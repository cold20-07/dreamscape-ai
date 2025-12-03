import { Navigation } from "@/components/ui/Navigation";
import { TimeLocation } from "@/components/ui/TimeLocation";
import { BottomBranding } from "@/components/layout/BottomBranding";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="relative min-h-screen w-full bg-mantis-black text-mantis-white overflow-hidden selection:bg-mantis-white selection:text-mantis-black">
            <TimeLocation />
            <Navigation />
            <OnboardingWizard />

            <main className="relative z-10 w-full">
                {children}
            </main>

            <BottomBranding />
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABERERmZmYzMzMyMjJEREQN0eLFAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCxQMIDX0I24fAAAAh0lEQVQ4y2NgQAaMDKiAEV0hI6pCRlSFjKgKGVEMM2IYZsQwbAgjhmFGDMOMGIYZMQwzYhhmxDCMkRE1YkSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjakSNqBEjKgAA6a4Hk9/2lQ4AAAAASUVORK5CYII=")`,
                    backgroundRepeat: 'repeat',
                }}
            ></div>
        </div>
    );
}
