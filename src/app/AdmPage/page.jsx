"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import HeaderAdm from "@/components/HeaderAdm";
import TuristicoAdm from "@/components/TuristicoAdm";
import RestaurantesAdm from "@/components/RestaurantesAdm";
import GastronomiaAdm from "@/components/GastronomiaAdm";


export default function AdmPage() {


	return (
		<div>
			<HeaderAdm />
			<section>
				<TuristicoAdm />
			</section>
			<section>
				<RestaurantesAdm />
			</section>
			<section>
				<GastronomiaAdm />
			</section>
		</div>
	);
}
