// Reference: COMPLETE INTRO TO REACT V8
// https://react-v8.holt.courses/lessons/special-case-react-tools/portals-and-refs

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
	const elRef = useRef(null);
	if (!elRef.current) {
		elRef.current = document.createElement("div");
	}

	useEffect(() => {
		const modalRoot = document.getElementById("modal");
		modalRoot.appendChild(elRef.current);
		return () => modalRoot.removeChild(elRef.current);
	}, []);

	return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
