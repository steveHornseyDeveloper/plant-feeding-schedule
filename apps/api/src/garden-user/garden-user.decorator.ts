import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GardenUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
  const raw = req.headers['x-garden-user'];
  if (!raw) {
    throw new BadRequestException('Missing X-Garden-User header');
  }
  const slug = String(raw).trim().toLowerCase();
  if (slug !== 'alexa' && slug !== 'stevie') {
    throw new BadRequestException(`Invalid X-Garden-User: ${slug}`);
  }
  return slug;
});
