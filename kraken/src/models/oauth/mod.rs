use rorm::prelude::*;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::models::{User, Workspace};

#[cfg(feature = "bin")]
mod operations;

/// An registered application which may perform oauth requests
#[derive(Model)]
pub struct OauthClient {
    /// The primary key as well as oauth's `client_id`
    #[rorm(primary_key)]
    pub uuid: Uuid,

    /// A name to show the user when asking for permissions
    #[rorm(max_length = 255)]
    pub name: String,

    /// oauth's `client_secret` to compare with in the `/token` request
    #[rorm(max_length = 255)]
    pub secret: String,

    /// oauth's `redirect_uri` to compare with in the initial `/auth` request
    #[rorm(max_length = 255)]
    pub redirect_uri: String,
}

/// A remembered decision for auto accepting or denying oauth requests
#[derive(Model)]
pub struct OAuthDecision {
    /// The primary key
    #[rorm(primary_key)]
    pub uuid: Uuid,

    /// The user who made the decision
    #[rorm(on_delete = "Cascade", on_update = "Cascade")]
    pub user: ForeignModel<User>,

    /// The application the decision was made for
    #[rorm(on_delete = "Cascade", on_update = "Cascade")]
    pub application: ForeignModel<OauthClient>,

    /// The requested workspace
    #[rorm(on_delete = "Cascade", on_update = "Cascade")]
    pub workspace: ForeignModel<Workspace>,

    /// Action what to do with new incoming oauth requests
    pub action: OAuthDecisionAction,
}

/// Action what to do with new oauth requests
#[derive(DbEnum, ToSchema, Serialize, Deserialize, Debug, Clone, Copy)]
pub enum OAuthDecisionAction {
    /// Auto accept new requests
    Accept,
    /// Auto deny new requests
    Deny,
}
