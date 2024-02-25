import useModal from "@/hooks/useModal";
import { useRef } from "react";
import getModalBlurVariants from "@/animation/variants/modalBlurVariants";
import styles from "@/styles/modules/shared/confirmModal.module.scss";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";

// Modal to confirm transition to Login page
type ConfirmModalProps = {
	closeCallback: () => void;
    redirectCallback: () => void;
	modalState: boolean;
	title: string;
};

export const ConfirmModal = ({
	closeCallback,
	modalState,
	title,
    redirectCallback,
}: ConfirmModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	useModal(modalRef, closeCallback, modalState);
	const handleTransitionClick = () => redirectCallback();

	const Modal = (
            <div key="confirmModal">
                <LazyMotion features={domAnimation}>
                    <m.div
                        ref={modalRef}
                        className={styles.confirmModal}
                        variants={getModalBlurVariants("17px")}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key="transitionURLmodal"
                    >
                        <p>{title}</p>
                        <div className={styles.btnWrapper}>
                            <button className={styles.cancelBtn} onClick={closeCallback}>
                                Отмена
                            </button>
                            <button
                                className={styles.successBtn}
                                onClick={handleTransitionClick}
                            >
                                Перейти
                            </button>
                        </div>
                    </m.div>
                    <Backdrop />
                </LazyMotion>
            </div>
	);

	return createPortal(Modal, document.body);
};
