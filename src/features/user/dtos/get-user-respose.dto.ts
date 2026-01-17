import { OmitType } from "@nestjs/swagger";
import { User } from "../entity/user.entity";

export class GetUserDtoResponse extends OmitType(User, [
  "password",
  "createdAt",
  "updatedAt",
] as const) {}
