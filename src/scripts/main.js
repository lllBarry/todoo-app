import axios from "axios"
import Swal from 'sweetalert2'

const TOKEN_NAME = "user_token"

const Main = () => ({
    showSection : "taskSection",
    email: "",
    nickname: "",
    password: "",
    isLogin: false,
    todos:[],
    task:"",
    // 關注 DATA Driven
    init(){
        // 檢查是否有token
        // 如果有token 設定為已登入
        const token = localStorage.getItem(TOKEN_NAME)
        if(token){
            this.isLogin= true
            this.showTaskInput()
            this.getTodos()
        }
        // console.log(token);
    },
    clearText(){
        this.email = ""
        this.nickname = ""
        this.password = ""
    },
    showLogin(){
        this.showSection = "loginSection"
    },
    showSignUp(){
        this.showSection = "signUpSection"
    },
    showTaskInput(){
        this.showSection = "taskSection"
    },
    async deleteTodo(id){
        // const { id } = this.$el.dataset
        const token = localStorage.getItem(TOKEN_NAME)
        
        if( token ){
            const url = `https://todoo.5xcamp.us/todos/${id}`
            const config = { headers: { Authorization: token } }
            this.$el.parentNode.parentNode.remove()

            try{
                await axios.delete(url, config)
                // this.getTodos()
            } catch (err) {
                Swal.fire({
                    title: 'Error!',
                    html: "無法刪除",
                    icon: 'error',
                    confirmButtonText: '確認'
                  })
            }
        }
    },
    async addTodo(){
        const token = localStorage.getItem(TOKEN_NAME)

        if(token && this.task != ""){
            const url = "https://todoo.5xcamp.us/todos"
            const todoData = {
                todo:{
                    content: this.task,
                },
            }
            const config = { headers: { Authorization: token } }
            
            try{
                const { data } = await axios.post(url, todoData, config)
                this.task=""
                this.todos.unshift(data)
            }catch(err){
                Swal.fire({
                    title: 'Error!',
                    html: err,
                    icon: 'error',
                    confirmButtonText: '確認'
                  })
            }
        }
    },
    async getTodos(){
        const url = "https://todoo.5xcamp.us/todos"
        const token = localStorage.getItem(TOKEN_NAME)
        if(token){
            const config = { headers: { Authorization: token } }
            
            try{
                const { data: {todos} } = await axios.get(url, config)
                // console.log(todos);
                this.todos = todos
            } catch (err){
                Swal.fire({
                    title: 'Error!',
                    html: "無法載入，請稍後再試",
                    icon: 'error',
                    confirmButtonText: '確認'
                  })
            }
        }
    },
    async signUp(){
        if (this.email !="" && this.nickname !="" && this.password !=""){
            const userData = {
                user:{
                    email : this.email,
                    nickname : this.nickname,
                    password : this.password,
                },
            }
            // await 使用時機
            // top level
            // async function 內
            try {
                await axios.post("https://todoo.5xcamp.us/users", userData)
                this.clearText()
                this.showLogin()
            } catch (err){
                const errText = err.response.data.error.join("<br />")
                Swal.fire({
                    title: 'Error!',
                    html: errText,
                    icon: 'error',
                    confirmButtonText: '確認'
                  })
                // Endpoint POST https://todoo.5xcamp.us/users
                // .join("/") => 列出陣列所有元素並加上/ 
            }
        }
    },
    async logout(){
        // 使用登出的API
        const url = "https://todoo.5xcamp.us/users/sign_out"
        // 傳 token 給API
        const token = localStorage.getItem(TOKEN_NAME)
        if(token){
            // axios.defaults.headers.common["Authorization"]=token
            
            try {
                const config = { headers: { Authorization: token } }
                await axios.delete(url, config)
            } catch {
                // 處理錯誤
            } finally {
                // 總是會做
                this.isLogin = false
                localStorage.removeItem(TOKEN_NAME)
                this.showLogin()
                this.todos=[]
            }
        }


    },
    async login(){
        if (this.email !="" && this.password !=""){
            const userData = {
                user:{
                    email: this.email,
                    password: this.password,
                },
            }
            try{
                const resp = await axios.post("https://todoo.5xcamp.us/users/sign_in",userData)
                const token = resp.headers.authorization
                // console.log(token);
                // 存token (jwt)
                // 瀏覽器內有 Cookie容量較小(4k) / LocalStorage容量較大 可以存token
                // localStorage .getItem()
                // localStorage .setItem()
                localStorage.setItem(TOKEN_NAME,token)
                this.clearText()
                this.isLogin = true
                this.showTaskInput()
            }catch (err){
                const errText = err.response.data.error
                Swal.fire({
                    title: 'Error!',
                    html: "登入失敗",
                    icon: 'error',
                    confirmButtonText: '確認'
                  })
            }
        }
    }
})

export default Main