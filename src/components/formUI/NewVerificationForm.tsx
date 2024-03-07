"use client";
import { useSearchParams } from "next/navigation";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { VerificationContainer } from "./formUI";
import { ClimbingBoxLoader } from "react-spinners";
import { useGlobalContext } from "@/hooks/useContext";
import { newVerificationAction } from "@/server_actions/form_actions";
import { useRouter } from "next/navigation";
import { useOrientation } from "@/hooks/useOrientation";

/* const MOBILE_QUERY = "(max-width: 500px)"; */
const SPINNER_SIZES = {
	mobile: 25,
	desktop: 40,
};
const LABEL_PENDING_TEXTS = {
	mobile: "Подтверждаем...",
	desktop: "Идёт подтверждение...",
};

const SPINNER_CSS_PROPS: {
	mobile: CSSProperties;
	desktop: CSSProperties;
} = {
	mobile: {
		width: "80%",
		height: "80%",
	},
	desktop: {
		width: "100%",
		height: "100%",
	},
};

export type VerificationState = "pending" | "error" | "success";
type StatusState = {
	type: VerificationState;
	message: string;
};

export const NewVerificationForm = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { theme } = useGlobalContext();
	const orientation = useOrientation();
	// status of verification
	const [status, setStatus] = useState<StatusState>({
		type: "pending",
		message: LABEL_PENDING_TEXTS[orientation === 'mobile' ? "mobile" : "desktop"],
	});

	const router = useRouter();

	const handleSubmit = useCallback(() => {
		// dont re-run if already have a result
		if (status.type === 'success' || status.type === 'error') {
			return;
		}

		if (!token) return;
		// Verify token action
		newVerificationAction(token)
			.then((data) => {
				// if success
				if (data.success) {
					setStatus({
						type: "success",
						message: data.success,
					});
				}
				// if error
				else if (data.error) {
					setStatus({
						type: "error",
						message: data.error,
					});
				}
			})
			.catch();
	}, [token, status.type]);

	// submitting on mount
	useEffect(() => {
		handleSubmit();
	}, [handleSubmit]);


	// redirect to login after success
	useEffect(() => {
		if (status.type === 'success') {
			router.push('/auth/login');
		}
	}, [status, router]);

	// spinner props
	const spinnerSize = orientation === 'mobile' ? SPINNER_SIZES.mobile : SPINNER_SIZES.desktop;
	const spinnerColor =
		theme == "dark" ? "hsl(0, 100%, 97%)" : "hsl(0, 38%, 19%)";
	const spinnerCss = orientation === 'mobile'
		? SPINNER_CSS_PROPS.mobile
		: SPINNER_CSS_PROPS.desktop;

	return (
		<form>
            <VerificationContainer
                status={status.type} 
                messageText={status.message}>
                {status.type === 'pending' && (
                    <ClimbingBoxLoader
                        color={spinnerColor}
                        cssOverride={spinnerCss}
                        size={spinnerSize}
                    />
                )}
            </VerificationContainer>
		</form>
	);
};
