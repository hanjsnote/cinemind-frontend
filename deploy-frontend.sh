#!/usr/bin/env bash
set -e

EC2_HOST=ubuntu@3.39.99.136
KEY_PATH=/Users/t2024-m0230/Downloads/cinemind_keypair.pem

echo "1) 프론트 빌드 중..."
npm run build

echo "2) dist 전송 중..."
scp -i "$KEY_PATH" -r dist/* "$EC2_HOST":~/cinemind-frontend-dist/

echo "3) EC2에서 nginx 루트로 복사 + reload..."
ssh -i "$KEY_PATH" "$EC2_HOST" '
  sudo rm -rf /var/www/cinemind-frontend/* &&
  sudo cp -r ~/cinemind-frontend-dist/* /var/www/cinemind-frontend/ &&
  sudo systemctl reload nginx
'

echo "프론트 배포 완료!"
