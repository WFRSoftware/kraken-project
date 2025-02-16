use actix_web::web::{Json, Path};
use actix_web::{delete, get, post, put, HttpResponse};
use futures::TryStreamExt;
use rand::distributions::{Alphanumeric, DistString};
use rand::thread_rng;
use rorm::prelude::ForeignModelByField;
use rorm::{and, insert, query, update, FieldAccess, Model};
use uuid::Uuid;

use crate::api::extractors::SessionUser;
use crate::api::handler::api_keys::schema::{
    CreateApiKeyRequest, FullApiKey, ListApiKeys, UpdateApiKeyRequest,
};
use crate::api::handler::common::error::{ApiError, ApiResult};
use crate::api::handler::common::schema::{PathUuid, UuidResponse};
use crate::chan::global::GLOBAL;
use crate::models::LeechApiKey;

/// Create new api key
#[utoipa::path(
    tag = "Api Keys",
    context_path = "/api/v1",
    responses(
        (status = 200, description = "Api key was created successfully", body = UuidResponse),
        (status = 400, description = "Client error", body = ApiErrorResponse),
        (status = 500, description = "Server error", body = ApiErrorResponse)
    ),
    request_body = CreateApiKeyRequest,
    security(("api_key" = []))
)]
#[post("/apiKeys")]
pub async fn create_api_key(
    req: Json<CreateApiKeyRequest>,
    SessionUser(user): SessionUser,
) -> ApiResult<Json<UuidResponse>> {
    let uuid = Uuid::new_v4();
    insert!(&GLOBAL.db, LeechApiKey)
        .return_nothing()
        .single(&LeechApiKey {
            uuid,
            user: ForeignModelByField::Key(user),
            key: Alphanumeric.sample_string(&mut thread_rng(), 32),
            name: req.name.clone(),
        })
        .await?;
    Ok(Json(UuidResponse { uuid }))
}

/// Delete an existing api key
#[utoipa::path(
    tag = "Api Keys",
    context_path = "/api/v1",
    responses(
        (status = 200, description = "Api key got deleted"),
        (status = 400, description = "Client error", body = ApiErrorResponse),
        (status = 500, description = "Server error", body = ApiErrorResponse)
    ),
    params(PathUuid),
    security(("api_key" = []))
)]
#[delete("/apiKeys/{uuid}")]
pub async fn delete_api_key(
    path: Path<PathUuid>,
    SessionUser(user): SessionUser,
) -> ApiResult<HttpResponse> {
    let deleted = rorm::delete!(&GLOBAL.db, LeechApiKey)
        .condition(and!(
            LeechApiKey::F.uuid.equals(path.uuid),
            LeechApiKey::F.user.equals(user)
        ))
        .await?;

    if deleted == 0 {
        Err(ApiError::InvalidUuid)
    } else {
        Ok(HttpResponse::Ok().finish())
    }
}

/// Retrieve all api keys
#[utoipa::path(
    tag = "Api Keys",
    context_path = "/api/v1",
    responses(
        (status = 200, description = "The uses api keys", body = ListApiKeys),
        (status = 400, description = "Client error", body = ApiErrorResponse),
        (status = 500, description = "Server error", body = ApiErrorResponse)
    ),
    security(("api_key" = []))
)]
#[get("/apiKeys")]
pub async fn get_api_keys(SessionUser(user): SessionUser) -> ApiResult<Json<ListApiKeys>> {
    let keys = query!(
        &GLOBAL.db,
        (LeechApiKey::F.key, LeechApiKey::F.name, LeechApiKey::F.uuid)
    )
    .condition(LeechApiKey::F.user.equals(user))
    .stream()
    .map_ok(|(key, name, uuid)| FullApiKey { key, name, uuid })
    .try_collect()
    .await?;
    Ok(Json(ListApiKeys { keys }))
}

/// Update an api key by its id
///
/// All parameter are optional, but at least one of them must be specified.
#[utoipa::path(
    tag = "Api Keys",
    context_path = "/api/v1",
    responses(
        (status = 200, description = "Api key got updated"),
        (status = 400, description = "Client error", body = ApiErrorResponse),
        (status = 500, description = "Server error", body = ApiErrorResponse)
    ),
    params(PathUuid),
    request_body = UpdateApiKeyRequest,
    security(("api_key" = []))
)]
#[put("/apiKeys/{uuid}")]
pub async fn update_api_key(
    path: Path<PathUuid>,
    req: Json<UpdateApiKeyRequest>,
    SessionUser(user): SessionUser,
) -> ApiResult<HttpResponse> {
    let req = req.into_inner();

    if req.name.is_empty() {
        return Err(ApiError::InvalidName);
    }

    let updated = update!(&GLOBAL.db, LeechApiKey)
        .set(LeechApiKey::F.name, req.name)
        .condition(and!(
            LeechApiKey::F.uuid.equals(path.uuid),
            LeechApiKey::F.user.equals(user)
        ))
        .exec()
        .await?;

    if updated == 0 {
        Err(ApiError::InvalidUuid)
    } else {
        Ok(HttpResponse::Ok().finish())
    }
}
