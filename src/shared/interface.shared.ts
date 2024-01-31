import { ApiException } from './exception.shared';
import { Left, Right } from './helpers.shared';

export type TPaginationInput = {
  take?: number;
  skip?: number;
};

export type TPaginationOutput<Entity> = {
  list: Entity[];
  meta: {
    taken: number;
    skipped: number;
    total: number;
  };
};

export type TEither<L = ApiException, R = unknown> = Left<L, R> | Right<L, R>;

export type TUseCaseBase<Input, Output> = {
  execute(input: Input): Output;
};
