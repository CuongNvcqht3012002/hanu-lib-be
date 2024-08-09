/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@ValidatorConstraint({ name: 'IsNotExist', async: true })
@Injectable()
export class IsNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, property = args.property] = args.constraints
    const entity = this.dataSource.getRepository(entityClass)
    const existingRecord = await entity.findOne({ where: { [property]: value } })
    return !existingRecord
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass] = args.constraints
    return `${entityClass.name} with this ${args.property} already exists`
  }
}

export function IsNotExist(
  entity: Function,
  property?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsNotExistConstraint,
    })
  }
}
