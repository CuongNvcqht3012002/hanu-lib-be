/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, property = args.property] = args.constraints
    const entity = this.dataSource.getRepository(entityClass)
    const existingRecord = await entity.findOne({ where: { [property]: value } })
    return !!existingRecord
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass] = args.constraints
    return `${entityClass.name} with this ${args.property} does not exist`
  }
}

export function IsExist(
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
      validator: IsExistConstraint,
    })
  }
}
