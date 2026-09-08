import Link from "next/link";

export function SelfServiceMenu() {
  const list: any[] = [];

  // if (!!config.selfservice.change_password.enabled) {
  //   list.push({
  //     link:
  //       `/me/change-password?` +
  //       new URLSearchParams({
  //         sessionId: sessionId,
  //       }),
  //     name: "Change password",
  //   });
  // }

  return (
    <div className="flex w-full flex-col space-y-2">
      {list.map((menuitem, index) => {
        return <SelfServiceItem link={menuitem.link} key={"self-service-" + index} name={menuitem.name} />;
      })}
    </div>
  );
}

const SelfServiceItem = ({ name, link }: { name: string; link: string }) => {
  return (
    <Link
      prefetch={false}
      href={link}
      className="navvia-choice group flex w-full flex-row items-center px-4 py-2 transition-all"
    >
      {name}
    </Link>
  );
};
