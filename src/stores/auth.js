import supabase from "@/connection";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
	state: () => ({ 
		user: false,
		user_data: null,
		pending: false
	}),
	getters: {

	},
	actions: {
		async authenticate({ email, password }) {
			this.pending = true
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			})

			if (error) {
				if (error?.code == "invalid_credentials") {
					this.pending = false
					return;
				}
				this.pending = false
				return;
			}
			const user = JSON?.parse(localStorage.getItem("sb-kuimahrftawdqfjskrcx-auth-token"))
			if (user) {
				const { data, error } = await supabase.from("users").select("type_user").eq("id", user.user.id)

				this.user = true
				this.user_data = user.user
				this.user_data.type_user=data[0].type_user

				localStorage.setItem("type_user",JSON.stringify(data[0].type_user))

				this.pending = false


			}
		},

		async singUp({ email, password, user }) {
			this.pending = true
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {	
						user_name: user
					}
				}
			})

			if (error?.code == "weak_password") {
				this.pending = false
				return
			}

			const { data: as, error: asd } = await supabase.auth.getSession()

			if (as.session) {
				const { data: daa, error: ee } = await supabase.from("users").insert([{ id: data.user.id, user_name: data.user.email }])
			
			}
			this.pending = false
			this.user_data = data.user
			this.user = true

		},

		async logout() {
			const { error } = await supabase.auth.signOut()

			localStorage.clear()

			this.user = false
			this.user_data = null
			this.pending = false
		},

		async initStore() {
			const user = localStorage.getItem("sb-kuimahrftawdqfjskrcx-auth-token")
			if (user) {
				const type_user = JSON.parse(localStorage.getItem("type_user"))
				this.user = true
				this.user_data = JSON.parse(user).user
				this.user_data.type_user=type_user
			}
		}

	}
})

