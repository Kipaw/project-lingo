import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
type Props = {
  children: React.ReactNode;
};
const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="flex flex-1 flex-col lg:pl-[256px]">
        <div className="mx-auto w-full max-w-[1056px] px-6 pt-6">
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
