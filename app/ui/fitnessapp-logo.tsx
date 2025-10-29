import { lusitana } from '@/app/ui/fonts';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function FitnessAppLogo() {
    return (
        <div
            className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
        >
            <HeartIcon className="h-12 w-12 fill-current drop-shadow-md mr-2" />
            <div className="flex flex-col">
                <p className="text-[30px]">PureMuscle</p>
                <span className="text-xs">Train. Recover. Repeat.</span>
            </div>
        </div>
    );
}
