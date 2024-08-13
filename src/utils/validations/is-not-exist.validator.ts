import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { DataSource } from 'typeorm'
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'

type ValidationEntity =
  | {
      id?: number | string
    }
  | undefined

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    // property example: email, userId, ...
    const property = validationArguments.property

    const repository = validationArguments.constraints[0] as string
    const currentValue = validationArguments.object as ValidationEntity
    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [property]: value,
      },
    })) as ValidationEntity

    if (entity?.[property] !== currentValue?.[property]) {
      return true
    }

    return !entity
  }
}
