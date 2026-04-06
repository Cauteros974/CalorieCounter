import { useUserStore } from "@/store/useUserStore";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileSchema = z.object ({
    fullName: z.string().min(1, 'The name is too short'),
    weight: z.string().transform(Number).pipe(z.number().min(30).max(300)),
    height: z.string().transform(Number).pipe(z.number().min(100).max(250)),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function profileScreen() {
    const setProfile = useUserStore((state) => state.setProfile);

    const {control, handleSubmit, formState: {errors} } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    })
}