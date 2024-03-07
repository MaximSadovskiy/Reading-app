import { useState, useEffect } from "react";
import styles from "@/styles/modules/formUI/formUI.module.scss";
import { CheckmarkSvg, CrossSvg, WarningSvg } from "../shared/Svg";
// animations
import {
	LazyMotion,
	domMax,
	m,
	AnimatePresence,
	LayoutGroup,
	useAnimate,
	domAnimation,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { listItemVariants } from "@/animation/variants/formUI/formVariants";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { VerificationState } from "./NewVerificationForm";
import Link from "next/link";

export enum SuccessMessages {
	REGISTER = "Регистрация завершена успешно, Вам отправлено подтверждение на указанный адрес электронной почты",
	LOGIN = "Вы успешно вошли в аккаунт!",
}

// GOOGLE provider submit
export const GoogleSubmit = () => {
	const handleProviderSubmit = () => {
		signIn("google", {
			callbackUrl: DEFAULT_LOGIN_REDIRECT,
		});
	};

	return (
		<div className={styles.provider}>
			<p id="google-label">Вход при помощи Google-аккаунта:</p>
			<button
				aria-labelledby="google-label"
				className={styles.providerBtn}
				type="button"
				onClick={handleProviderSubmit}
			>
				<FcGoogle width={30} height={30} />
			</button>
		</div>
	);
};

export const Divider = () => {
	return (
		<div className={styles.divider}>
			<span>ИЛИ</span>
		</div>
	);
};

// Form Field

interface FormFieldProps {
	labelText: string;
	isError: boolean;
	errorText?: string;
	children: React.ReactNode;
}

export const FormFieldWrapper = ({
	labelText,
	isError,
	errorText,
	children,
}: FormFieldProps) => {
	return (
		<div className={styles.formFieldWrapper}>
			<label>{labelText}</label>
			{children}
			{isError && (
				<p role="alert" className={styles.error}>
					{errorText}
				</p>
			)}
		</div>
	);
};

// custom select

export type GenresToSelect =
	| "Антиутопия"
	| "Биография"
	| "Роман"
	| "Фантастика"
	| "Фэнтези"
	| "Детектив"
	| "Триллер"
	| "Классика";

interface SelectProps {
	options: Array<GenresToSelect>;
	onChange: (selectedOptions: GenresToSelect[]) => void;
	isError: boolean;
	errorText?: string;
	isInvalid: boolean;
}

interface OptionWithName extends HTMLDivElement {
	dataset: {
		name: GenresToSelect;
	};
}

export const Select = ({
	options,
	onChange,
	isError,
	errorText,
	isInvalid,
}: SelectProps) => {
	const [selectedOptions, setSelectedOptions] = useState<GenresToSelect[]>(
		[]
	);

	// эффект чтобы передать актуальное состояние в hook-form
	useEffect(() => {
		onChange(selectedOptions);
	}, [selectedOptions, onChange]);

	// event handlers
	const deleteOptionFromPanel = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest(
			'[data-option-type="panelOption"]'
		) as OptionWithName;
		const optionName = target.dataset.name;

		setSelectedOptions(
			selectedOptions.filter((option) => option !== optionName)
		);

		target.blur();
	};

	const toggleSelectionFromList = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest(
			'[data-option-type="listOption"]'
		) as OptionWithName;

		const optionName = target.dataset.name;

		if (selectedOptions.includes(optionName)) {
			setSelectedOptions(
				selectedOptions.filter((option) => option !== optionName)
			);
		} else {
			setSelectedOptions([...selectedOptions, optionName]);
		}

		target.blur();
	};

	// options inside panel of selection
	const renderingSelectedOptions = selectedOptions.map((option) => (
		<m.li
			className={styles.panelOptionWrapper}
			key={`select-${option}`}
			variants={listItemVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			layout
			transition={{
				layout: {
					duration: 0.75,
				},
			}}
		>
			<div
				className={styles.panelOption}
				data-name={option}
				data-option-type="panelOption"
			>
				<button type="button" onClick={deleteOptionFromPanel}>
					<CrossSvg width={30} height={30} />
				</button>
				<span>{option}</span>
			</div>
		</m.li>
	));

	const renderingOptionList = options.map((option) => (
		<OptionInsideList
			key={option}
			value={option}
			isSelected={selectedOptions.includes(option) ? true : false}
			onClick={toggleSelectionFromList}
		/>
	));

	return (
		<div className={styles.select}>
			<label>Выберите ваши любимые жанры литературы:</label>
			{/* SELECTION PANEL */}
			<LazyMotion features={domMax}>
				<LayoutGroup>
					<m.ul
						className={`${styles.selectionPanel} ${
							selectedOptions.length === 0
								? styles.panelEmpty
								: ""
						}`}
						data-invalid={isInvalid}
						layout
						transition={{
							duration: 0.75,
						}}
					>
						<AnimatePresence mode="popLayout">
							{selectedOptions.length > 0 ? (
								renderingSelectedOptions
							) : (
								<m.span
									className={styles.placeholder}
									variants={listItemVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								>
									*здесь будут отображаться выбранные жанры*
								</m.span>
							)}
						</AnimatePresence>
					</m.ul>
					{/* ERROR */}
					{isError && (
						<m.p
							layout
							className={styles.error}
							variants={listItemVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							{errorText}
						</m.p>
					)}
					{/* LIST OF OPTIONS */}
					<m.ul
						className={styles.listOfOptions}
						layout
						transition={{
							duration: 0.75,
						}}
					>
						{renderingOptionList}
					</m.ul>
				</LayoutGroup>
			</LazyMotion>
		</div>
	);
};

type ClickHandler = (e: React.MouseEvent) => void;

// option inside List
interface OptionListProps {
	value: GenresToSelect;
	isSelected: boolean;
	onClick: ClickHandler;
}

const OptionInsideList = ({ value, isSelected, onClick }: OptionListProps) => {
	return (
		<li
			className={`${styles.listOptionWrapper} ${
				isSelected ? styles.wrapperSelected : ""
			}`}
		>
			<button
				type="button"
				onClick={onClick}
				className={`${styles.listOption} ${
					isSelected ? styles.selected : ""
				}`}
				data-name={value}
				data-option-type="listOption"
			>
				{isSelected && (
					<div className={styles.checkSvgWrapper}>
						<CheckmarkSvg width={30} height={30} />
					</div>
				)}
				<span>{value}</span>
			</button>
		</li>
	);
};

// Submit button
type SubmitBtnProps = {
 	isDisabled: boolean;
	isTwoFactor?: boolean;
}

export const SubmitBtn = ({ isDisabled, isTwoFactor }: SubmitBtnProps) => {
	const [scope, animate] = useAnimate();
	const scaleForegroundX = useMotionValue(0);
	const color = useTransform(
		scaleForegroundX,
		[0, 0.5, 1],
		["#000", "#b15800", "#fac28d"]
	);

	const handleMouseEnter = () => {
		animate(scaleForegroundX, 1, { duration: 0.5 });
	};

	const handleMouseLeave = () => {
		animate(scaleForegroundX, 0, { duration: 0.4 });
	};

	const handleMouseUp = () => {
		animate(scaleForegroundX, 0, { duration: 0.4 });
	};

	return (
		<LazyMotion features={domAnimation}>
			<m.button
				ref={scope}
				type="submit"
				className={styles.submitBtn}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onMouseUp={handleMouseUp}
				disabled={isDisabled}
			>
				<m.div
					data-name="foreGround"
					style={{
						scaleX: scaleForegroundX,
					}}
				></m.div>
				<m.span
					style={{
						color,
					}}
				>
					{isTwoFactor ? 'Подтвердить' : 'Отправить'}
				</m.span>
			</m.button>
		</LazyMotion>
	);
};

type SubmitStatusType = "pending" | "error" | "success";

export const SubmitStatus = ({
	status,
	message,
}: {
	status: SubmitStatusType;
	message?: string;
}) => {
	if (status === "pending" && !message) {
		const pendingMessage = "Данные отправляются...";

		return (
			<div className={`${styles.submitStatus} ${styles.pending}`}>
				{pendingMessage}
			</div>
		);
	}

	const colorValue =
		status === "success" ? "hsl(130, 73%, 32%)" : "hsl(0, 89%, 31%)";
	const statusClassName =
		status === "success" ? "success-status" : "error-status";

	return (
		<LazyMotion features={domAnimation}>
			<AnimatePresence>
				<m.div
					className={`${styles.submitStatus} ${styles[statusClassName]}`}
					style={{
						position: "relative",
					}}
					variants={listItemVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					{/* Success svg */}
					{status === "success" && (
						<CheckmarkSvg
							width={60}
							height={60}
							color={colorValue}
						/>
					)}
					{/* Error svg */}
					{status === "error" && (
						<WarningSvg 
							width={60} 
							height={60} 
							color={colorValue} 
						/>
					)}
					{/* Message to user */}
					{message}
				</m.div>
			</AnimatePresence>
		</LazyMotion>
	);
};

// Verification form
type VerificationContainerProps = {
	children: React.ReactNode;
	messageText: string;
	status: VerificationState;
};

export const VerificationContainer = ({
	status,
	messageText,
	children,
}: VerificationContainerProps) => {
	return (
		<LazyMotion features={domAnimation}>
			<AnimatePresence>
				<m.div 
					className={styles.verificationWrapper}
					variants={listItemVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					<label
						data-status={status}
					>
						{messageText}
					</label>
					{children}
				</m.div>
			</AnimatePresence>
		</LazyMotion>
	);
};


// Forgot Password
export const ForgotPassword = () => {

	return (
		<div className={styles.forgotPassword}>
			<Link href='/auth/reset'>Забыли пароль?</Link>
		</div>
	)
};