# Cadmus Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.4.

This is a refactoring of the [original shell app](https://github.com/vedph/cadmus-bricks-shell), upgraded to fully support Angular 13+ and remove code which has been refactored into external independent libraries.

All the version numbers of this refactoring, having a number of breaking changes, start from `1.0.0`. All the Docker images versions start from `2.0.0`.

Quick Docker image build:

1. `npm run build-all`
2. `ng build --prod`
3. `docker build . -t vedph2020/cadmus-shell:2.0.0 -t vedph2020/cadmus-shell:latest` (replace with the current version).

## History

- 2022-01-04: added `MetadataPart` to `cadmus-part-general-ui` and `cadmus-part-general-pg`.
- 2021-12-20: upgraded Angular and fixed ID passed via `getItemLayerInfo` in state library.
- 2021-12-18: recreated an Angular 13.0.4 workspace and moved old shell libraries into it while refactoring:
  - auth-related libraries replaced with `@myrmidon/auth-jwt-login` and `@myrmidon/auth-jwt-admin`.
  - base model editor slightly refactored to use new services.
  - generic models and their editors replaced with bricks.
  - comment part and fragment now uses `ExternalId`'s for IDs rather than an array of strings. This is also reflected in the backend models (`Cadmus.Parts` from version 2.7.0, `Cadmus.Seed.Parts` from version 1.5.0).
  - Cadmus material removed, and replaced by more granular imports in each Material consumer.
