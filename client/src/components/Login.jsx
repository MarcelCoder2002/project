import axios from "axios";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getBackendURL } from "../utils/url";

export const action = async ({ request }) => {
	let path = window.location.pathname;
	if (path !== "/") {
		path = "/" + path.split("/")[1];
	}

	const data = {};
	for (let [key, value] of (await request.formData()).entries()) {
		data[key] = value;
	}

	try {
		const response = await axios.post(getBackendURL(`${path}/login`), data);
		if (response.data.error) {
			alert(response.data.error);
		} else {
			sessionStorage.setItem("accessToken", response.data.accessToken);
			return redirect("../");
		}
	} catch (error) {
		alert("Login failed");
	}
	return redirect("");
};

function Login({ action, title }) {
	return (
		<div className="login-box">
			<div className="login-logo">
				<Link to="/">Jolof System</Link>
			</div>
			{/* /.login-logo */}
			<div className="card">
				<div className="card-body login-card-body">
					<p className="login-box-msg">
						{title ? title : "Connexion"}
					</p>
					<Form action={action} method="post">
						<div className="input-group mb-3">
							<input
								type="email"
								className="form-control"
								placeholder="Email"
								name="email"
								id="email"
							/>
							<div className="input-group-append">
								<div className="input-group-text">
									<span className="fas fa-envelope" />
								</div>
							</div>
						</div>
						<div className="input-group mb-3">
							<input
								type="password"
								className="form-control"
								placeholder="Mot de passe"
								name="motDePasse"
								id="motDePasse"
							/>
							<div className="input-group-append">
								<div className="input-group-text">
									<span className="fas fa-lock" />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-8">
								<div className="icheck-primary">
									<input type="checkbox" id="rememberMe" />
									<label htmlFor="rememberMe">
										Se souvenir de moi
									</label>
								</div>
							</div>
							{/* /.col */}
							<div className="col-4">
								<button
									type="submit"
									className="btn btn-primary btn-block"
								>
									Se connecter
								</button>
							</div>
							{/* /.col */}
						</div>
					</Form>
					<div className="social-auth-links text-center mb-3">
						<p>- OU -</p>
						<a href="#" className="btn btn-block btn-primary">
							<i className="fab fa-facebook mr-2" /> Se connecter
							avec Facebook
						</a>
						<a href="#" className="btn btn-block btn-danger">
							<i className="fab fa-google-plus mr-2" /> Se
							connecter avec Google+
						</a>
					</div>
					{/* /.social-auth-links */}
					<p className="mb-1">
						<a href="forgot-password.html">
							J'ai oublié mon mot de passe
						</a>
					</p>
					<p className="mb-0">
						<a href="register.html" className="text-center">
							S'inscrire
						</a>
					</p>
				</div>
				{/* /.login-card-body */}
			</div>
		</div>
	);

	return (
		<>
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="card mt-5">
							<div className="card-body shadow-lg">
								<h3 className="card-title text-center">
									{title ? title : "Connexion"}
								</h3>
								<form onSubmit={handleSubmit}>
									<div className="mb-3">
										<label
											htmlFor="email"
											className="form-label"
										>
											Adresse email
										</label>
										<input
											type="email"
											className="form-control"
											id="email"
											name="email"
											aria-describedby="emailHelp"
										/>
										<div
											id="emailHelp"
											className="form-text"
										>
											We'll never share your email with
											anyone else.
										</div>
									</div>
									<div className="mb-3">
										<label
											htmlFor="password"
											className="form-label"
										>
											Mot de passe
										</label>
										<input
											type="password"
											className="form-control"
											id="password"
											name="motDePasse"
										/>
									</div>
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="remember_me"
											name="remember_me"
										/>
										<label
											className="form-check-label"
											htmlFor="remember_me"
										>
											Se souvenir de moi
										</label>
									</div>
									<button
										type="submit"
										className="btn btn-primary"
									>
										Se connecter
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
