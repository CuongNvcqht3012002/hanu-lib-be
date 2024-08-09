import { CoreEntity } from '@/utils/core/core-entity'
import { infinityPagination } from '@/utils/infinity-pagination'
import { HttpNotFound } from '@/utils/throw-exception'
import { IPaginationOptions } from '@/utils/types/pagination-options'
import { Repository, DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class CoreService<T extends CoreEntity> {
  protected constructor(protected readonly repo: Repository<T>) {}

  create(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(dto)
    return this.repo.save(entity)
  }

  async findAll(options?: FindManyOptions<T>) {
    const [data, count] = await this.repo.findAndCount(options)
    return { data, count }
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    findOptions: FindManyOptions<T> = {}
  ) {
    const { limit, page } = paginationOptions
    const skip = page ? (page - 1) * limit : undefined

    const [data, count] = await this.repo.findAndCount({
      ...findOptions,
      take: limit,
      skip,
    })

    return infinityPagination({ data, count }, paginationOptions)
  }

  async findOne(options: FindOneOptions<T>) {
    const entity = await this.repo.findOne(options)
    if (!entity) HttpNotFound()
    return entity
  }

  async update(id: number, dto: QueryDeepPartialEntity<T>) {
    await this.findOne({ where: { id } } as FindOneOptions<T>)
    return await this.repo.update(id, dto)
  }
}
