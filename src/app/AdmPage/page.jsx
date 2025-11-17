"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import HeaderAdm from "@/components/HeaderAdm";
import TuristicoAdm from "@/components/TuristicoAdm";


export default function AdmPage() {


	return (
		<div>
			<HeaderAdm />
			<section>
				<TuristicoAdm />
			</section>
		</div>
	);
}
