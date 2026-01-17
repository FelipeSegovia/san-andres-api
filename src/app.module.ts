import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configValidationSchema } from "./common/environment.validation";
import { UserModule } from "./features/user/user.module";
import { DatabaseModule } from "./common/db/database.module";
import { AuthModule } from "./features/auth/auth.module";
import { RolesModule } from "./features/roles/roles.module";
import { EnrollmentsModule } from "./features/enrollments/enrollments.module";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport:
          process.env.NODE_ENV !== "production"
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
                },
              }
            : undefined,
        redact: {
          paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "req.headers['x-api-key']",
            "req.body.password",
            "req.body.token",
            "res.headers['set-cookie']",
          ],
          remove: true,
        },
        autoLogging: {
          ignore: (req) => req.url === "/health" || req.url === "/alive",
        },
        genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
        customProps: (req) => ({
          requestId: req.id,
        }),
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    RolesModule,
    EnrollmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
