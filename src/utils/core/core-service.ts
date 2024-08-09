import { infinityPagination } from '@/utils/infinity-pagination'
import { HttpNotFound } from 'src/utils/throw-exception'
import { Repository, DeepPartial } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { EntityCondition } from 'utils/types/entity-condition.type'
import { IPaginationOptions } from 'utils/types/pagination-options'

export abstract class CoreService<T extends CoreEntity> {
  protected constructor(protected readonly repo: Repository<T>) {}

  async create(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(dto)
    const [createdEntity] = await this.repo.save([entity])
    return createdEntity
  }

  async findAll() {
    const data = await this.repo.find()
    return { data, count: data.length }
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    withDeleted = false,
    where?: EntityCondition<T>,
    relations?: object | string[]
  ) {
    const { limit, page } = paginationOptions

    const [data, count] = await Promise.all([
      this.repo.find({
        skip: page ? (page - 1) * limit : null,
        take: limit ? limit : null,
        withDeleted,
        where,
        relations,
      }),
      this.getTotalCount(),
    ])
    return infinityPagination({ data, count }, paginationOptions)
  }

  findManyWithPaginationWithDeleted(
    paginationOptions: IPaginationOptions,
    where?: EntityCondition<T>,
    relations?: object | string[]
  ) {
    return this.findManyWithPagination(paginationOptions, true, where, relations)
  }

  async findOne(fields: EntityCondition<T>, withDeleted = false, relations?: object | string[]) {
    const entity = await this.repo.findOne({
      where: fields,
      withDeleted,
      relations,
    })
    if (!entity) HttpNotFound()
    return entity
  }

  findOneWithDeleted(fields: EntityCondition<T>, relations?: object | string[]) {
    return this.findOne(fields, true, relations)
  }

  async update(id: number, dto: DeepPartial<T>) {
    // With findOne function, it will return not found exception if the entity is not found
    this.findOne({ id } as EntityCondition<T>)

    const updateData: DeepPartial<T> = { id, ...dto }
    const result = await this.repo.save(updateData)
    return result
  }

  async softDelete(id: number): Promise<void> {
    await this.repo.softDelete(id)
  }

  async recoverEntity(fields: EntityCondition<T>) {
    const entity = await this.findOneWithDeleted(fields)
    if (!entity) HttpNotFound()
    return entity.save()
  }

  getTotalCount(): Promise<number> {
    return this.repo.count()
  }
}
