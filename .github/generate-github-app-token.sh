#!/bin/bash

# デバッグ用
set -x

# JWTヘッダーの生成
header=$(echo -n "{\"alg\":\"RS256\",\"typ\":\"JWT\"}" | base64 -w0)

# JWTペイロードの生成
now=$(date +%s)
iat=$(($now - 60))
exp=$(($now + 600))
payload=$(echo -n "{\"iat\":$iat,\"exp\":$exp,\"iss\":$APP_ID}" | base64 -w0)

# 署名なしトークンの生成
unsigned_token=$header.$payload

# トークンの署名
signed_token=$(echo -n $unsigned_token | openssl dgst -binary -sha256 -sign <(echo "$APP_PRIVATE_KEY") | base64 -w0)

# 最終的なJWTの生成
jwt=$unsigned_token.$signed_token

# インストールトークンの取得
installation_token=$(
  curl -s -X POST \
  -H "Authorization: Bearer $jwt" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/app/installations/$INSTALLATION_ID/access_tokens \
  | jq -r ".token" \
)

# トークンの出力
if [ -z "$installation_token" ]; then
  echo "Error: Installation token could not be retrieved."
  exit 1
else
  echo "$installation_token"
fi
