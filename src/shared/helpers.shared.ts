import { TPaginationInput, TPaginationOutput } from './interface.shared';

export class PaginationInputHelper {
  static exec(params: TPaginationInput) {
    return {
      take: Number(params.take) || undefined,
      skip: Number(params.skip) || undefined,
    };
  }
}

export class PaginationOutputHelper {
  static exec<T>(
    data: T[],
    skipped: number,
    total: number,
  ): TPaginationOutput<T> {
    return {
      list: data,
      meta: {
        skipped,
        taken: data.length,
        total,
      },
    };
  }
}

export class Right<L, R> {
  constructor(public readonly value?: R) {}

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export class Left<L, R> {
  constructor(public readonly exception: L) {}

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}
