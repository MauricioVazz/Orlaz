
"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

const cidades = [
	{ value: "", label: "Selecione" },
	{ value: "CARAGUATATUBA", label: "Caraguatatuba" },
	{ value: "UBATUBA", label: "Ubatuba" },
	{ value: "SAO_SEBASTIAO", label: "São Sebastião" },
	{ value: "ILHABELA", label: "Ilhabela" },
];

export default function CadastroRestaurante() {
	const [form, setForm] = useState({
		name: "",
		description: "",
		address: "",
		website: "",
		city: "",
		images: []
	});
	const [files, setFiles] = useState([]);
	const [msg, setMsg] = useState("");
	const [preview, setPreview] = useState([]);
	const [uploading, setUploading] = useState(false);

	// Preview das imagens
	const handleFiles = e => {
		const filesArr = Array.from(e.target.files);
		setFiles(filesArr);
		setPreview(filesArr.map(file => URL.createObjectURL(file)));
	};

	// Envio do formulário
	const handleSubmit = async e => {
		e.preventDefault();
		setMsg("Enviando...");
		setUploading(true);
		const formData = new FormData();
		formData.append("name", form.name);
		formData.append("description", form.description);
		formData.append("address", form.address);
		formData.append("website", form.website);
		formData.append("city", form.city);
		files.forEach(f => formData.append("images", f));
		try {
			const resp = await fetch("http://localhost:3000/restaurant/with-images", {
				method: "POST",
				body: formData
			});
			const data = await resp.json();
			if (resp.ok) {
				setMsg("Restaurante cadastrado com sucesso!");
				setForm({ name: "", description: "", address: "", website: "", city: "", images: [] });
				setFiles([]);
				setPreview([]);
			} else {
				setMsg(data.error || "Erro ao cadastrar restaurante.");
			}
		} catch {
			setMsg("Erro ao conectar com o servidor.");
		}
		setUploading(false);
	};

	return (
		<div className={styles.container}>
					<h1 className={styles.title}>Cadastro de Restaurante</h1>
					<form onSubmit={handleSubmit}>
						<label className={styles.label} htmlFor="name">Nome</label>
						<input className={styles.input} type="text" id="name" value={form.name} required
							onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

						<label className={styles.label} htmlFor="description">Descrição</label>
						<textarea className={styles.textarea} id="description" value={form.description} required
							onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

						<label className={styles.label} htmlFor="address">Endereço</label>
						<input className={styles.input} type="text" id="address" value={form.address} required
							onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />

						<label className={styles.label} htmlFor="website">Website</label>
						<input className={styles.input} type="text" id="website" value={form.website}
							onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />

						<label className={styles.label} htmlFor="city">Cidade</label>
						<select className={styles.select} id="city" value={form.city} required
							onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
							{cidades.map(c => (
								<option key={c.value} value={c.value}>{c.label}</option>
							))}
						</select>

						<label className={styles.label} htmlFor="images">Imagens</label>
						<div className={styles.imagesHint}>
							Você pode <b>arrastar e soltar</b> imagens do seu explorador de arquivos aqui ou clicar para selecionar.
						</div>
						<input className={styles.fileInput} type="file" id="images" accept="image/*" multiple required onChange={handleFiles} />
						<div className={styles.imagesPreview}>
							{preview.map((src, i) => (
								<img key={i} src={src} alt="preview" />
							))}
						</div>

						<button className={styles.button} type="submit" disabled={uploading}>Cadastrar</button>
						<div className={styles.msg}>{msg}</div>
					</form>
		</div>
	);
}
