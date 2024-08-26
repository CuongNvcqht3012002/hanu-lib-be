import { CoreEntity } from '@/utils/core/core-entity'
import { infinityPagination } from '@/utils/infinity-pagination'
import { HttpNotFound } from '@/utils/throw-exception'
import { IPaginationOptions } from '@/utils/types/pagination-options'
import { Repository, DeepPartial, FindManyOptions, FindOneOptions, UpdateResult } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class CoreService<T extends CoreEntity> {
  protected constructor(protected readonly repo: Repository<T>) {}

  async create(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(dto)
    return await this.repo.save(entity)
  }

  async findAll(options?: FindManyOptions<T>): Promise<{ data: T[]; count: number }> {
    const [data, count] = await this.repo.findAndCount({
      ...options,
      order: {
        id: 'ASC',
        ...options?.order,
      },
    })
    return { data, count }
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    findOptions: FindManyOptions<T> = {}
  ) {
    const { limit, page } = paginationOptions
    const skip = page ? (page - 1) * limit : 0

    const [data, count] = await this.repo.findAndCount({
      ...findOptions,
      take: limit,
      skip,
      order: {
        id: 'ASC',
        ...findOptions?.order,
      },
    })

    return infinityPagination({ data, count }, paginationOptions)
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repo.findOne(options)
    if (!entity) HttpNotFound()
    return entity
  }

  async update(id: number, dto: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    await this.findOne({ where: { id } } as FindOneOptions<T>)
    return await this.repo.update(id, dto)
  }

  async softDelete(id: number): Promise<UpdateResult> {
    await this.findOne({ where: { id } as FindOneOptions<T>['where'] })
    return await this.repo.softDelete(id)
  }

  async restore(id: number): Promise<UpdateResult> {
    await this.findOne({
      where: { id } as FindOneOptions<T>['where'],
      withDeleted: true,
    })
    return await this.repo.restore(id)
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return await this.repo.count(options)
  }
}
