export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
      {children}
    </div>
  );
}
