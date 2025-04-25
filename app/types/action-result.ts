export type ORIGIN = "email" | "password";

export type ActionResultSuccess<T> = {
  success: true;
  origin?: ORIGIN;
  message: string;
  data: T | null;
};

export type ActionResultError<T> = {
  success: false;
  origin: ORIGIN;
  message: string;
  data: T | null;
};

export type ActionResult<T> = ActionResultSuccess<T> | ActionResultError<T>;
