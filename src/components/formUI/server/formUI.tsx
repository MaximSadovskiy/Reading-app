import Link from "next/link";

export const LoginTitle = ({ text }: { text: string }) => {
	return <h2>{text}</h2>;
};

export const LoginLink = ({ text, href }: { text: string; href: string }) => {
	return <Link href={href}>{text}</Link>;
};
