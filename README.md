#PNPM monorepo merge into dev


```sh
docker build \
--platform=linux/amd64 \
--build-arg NODE_ENV=production \
-t otp-backend:latest \
-f apps/backend/Dockerfile \
.
```

```sh
docker tag otp-backend:latest 774305577345.dkr.ecr.eu-west-2.amazonaws.com/otp-backend:latest
docker push 774305577345.dkr.ecr.eu-west-2.amazonaws.com/otp-backend:latest
```

```sh
docker run --env-file <env-file-path> <image-id>
```

## Working with stripe Locally

Dowload [Stripe CLI](https://docs.stripe.com/stripe-cli)

```sh
stripe login
```

```sh
stripe listen --forward-to localhost:<backend_port_number>/webhooks/stripe/subscriptions
```