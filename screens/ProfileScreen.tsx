import * as z from 'zod';

const profileSchema = z.object ({
    fullName: z.string().min(1, 'The name is too short'),
    weight: z.string().transform(Number).pipe(z.number().min(30).max(300)),
    height: z.string().transform(Number).pipe(z.number().min(100).max(250)),
});