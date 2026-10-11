# AWS deployment notes

PunarChakra can run on AWS as a standard Next.js Node.js server inside a Docker container. The recommended route for this app is Amazon ECS Express Mode, which accepts a container image and manages the service's load balancer, HTTPS endpoint, logging, and scaling.

## Keep Supabase as the application backend

The app currently uses Supabase Auth and Supabase Postgres through `@supabase/ssr` and `@supabase/supabase-js`. It does not call AWS APIs or require AWS SDK credentials. Keep the existing Supabase project; AWS is only hosting the Next.js web server and its static assets.

The app needs these Supabase values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Next.js embeds `NEXT_PUBLIC_*` values into the browser bundle during the image build. Supply both as Docker build arguments, and rebuild the image if either value changes. Use the same values in the ECS service environment if the server process needs them at runtime. These are public client values; never substitute a Supabase `service_role` key.

## Build the container image

The repository includes a multi-stage `Dockerfile`. It builds the production app with Next.js standalone output and runs it as an unprivileged user on port `8080`.

If Docker cannot run on the development computer, the root-level `buildspec.yml` lets AWS CodeBuild build the image and push it to Amazon ECR. This keeps the same ECS Express Mode deployment route and avoids local WSL or Docker setup.

For the CodeBuild project, use a Linux build environment with Docker support and privileged mode enabled. Configure these environment variables in the project:

- `AWS_ACCOUNT_ID`: the AWS account that owns the ECR repository.
- `AWS_DEFAULT_REGION`: the same region as the ECR repository.
- `ECR_REPOSITORY`: an existing ECR repository name.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the existing Supabase project values. They are public client values, not service-role credentials.

The CodeBuild service role needs permission to obtain an ECR authorization token and push image layers and manifests to that repository. The build tags the image with the first 12 characters of the resolved source revision. Use the resulting ECR image URI in the ECS Express Mode service. The repository must exist before the first push.

Set the two Supabase values in the shell used for the build, then build the image while forwarding those variables:

```powershell
docker build `
  --build-arg NEXT_PUBLIC_SUPABASE_URL `
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY `
  --tag punarchakra:latest .
```

The `.dockerignore` excludes `.env*`, so local environment files are not copied into the image or build context.

## AWS service settings

For an ECS Express Mode service, use:

- Container image: the PunarChakra image pushed to Amazon ECR (or another registry the task can pull from).
- Container port: `8080`.
- Health check path: `/` (the current home page returns HTTP 200 without requiring authentication).
- Environment: the two Supabase public values above, matching the image build.
- IAM: an ECS task execution role for image pulls and logs, plus the ECS Express Mode infrastructure role. The app itself does not need an AWS task role unless it later starts calling AWS services.

Express Mode provisions supporting ECS/Fargate, load balancing, HTTPS, CloudWatch logging, and scaling resources. It requires an accessible container image and AWS account permissions; the AWS roles and service are not created by these repository files.

After AWS provides the service URL, add that HTTPS URL to Supabase Auth's URL Configuration as the production Site URL and an allowed redirect URL. This lets Supabase send confirmations and authentication redirects back to the hosted app.

## Why not Amplify Hosting for this app today?

AWS Amplify Hosting's current SSR support page lists Next.js versions 12 through 15. This app uses Next.js 16.3.8, so use the general container path until AWS documents support for this version. A Docker deployment also keeps the regular Next.js server behavior, including Proxy and Server Actions.

## References

- [Amazon ECS Express Mode: getting started](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-getting-started.html)
- [Resources created by ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-work.html)
- [Build and push a Docker image to Amazon ECR with CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)
- [AWS Amplify support for Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)
- [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Supabase Auth URL configuration](https://supabase.com/docs/guides/auth/general-configuration)
