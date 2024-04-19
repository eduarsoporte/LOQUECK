firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $("#procesos").load("./pages/chat.html")
        $("#cerrarSesion").removeClass("d-none")
        db.collection("chat").orderBy("index", "desc").onSnapshot((query)=>{
            const contenido = document.getElementById("contenido")
            contenido.innerHTML = ""
            query.forEach(element =>{
                const doc = element.data()
                contenido.innerHTML += `<div class="cnt__msj d-flex flex-column animate__animated animate__fadeIn">
                                    <div class="cnt__info d-flex align-items-center">
                                    <i class="fa-solid fa-user"></i>
                                    <span>${doc.nombre}</span>
                                    </div>
                                    <div class="msj">${doc.mensaje}</div>
                                    <div class="cnt__fecha">${doc.fecha}</div>
                                    <hr>
                
                               </div>`
            })
        })
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/v8/firebase.User
      var uid = user.uid;
      // ...
    } else {
        cargarContenidologin()
        $("#cerrarSesion").addClass("d-none")
      // User is signed out
      // ...
    }
  });

  function registro(){
    const nombre = document.getElementById("registerName").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // signed in
        //var user = userCredential.user;

    }).then(() => {
        // Signed in       
        db.collection("usuario").add({
          nombre: nombre,
          email: email,

        }).catch((error) =>{
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        })

        // ...
        // ...      
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
    localStorage.setItem("userName", nombre);

}

function cerrar(){
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}

function login(){
    const email = document.getElementById("loginName").value
    const password = document.getElementById("loginPassword").value
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    db.collection("usuario").where("email", "==", email).get().then((query)=>{
        query.forEach(element =>{
            var nombrex = element.data().nombre
            localStorage.setItem("userName", nombrex);
        })           
    })
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

function enviar() {
    // Obtener el valor del campo de entrada
    const mensajeInput = document.getElementById("inputChat");
    const mensaje = mensajeInput.value;

    // Obtener el nombre de usuario almacenado en localStorage
    const nombreUser = localStorage.getItem("userName");

    // Verificar si el mensaje no está vacío
    if (mensaje.trim() === "") {
        console.error("El mensaje está vacío");
        return; // Salir de la función si el mensaje está vacío
    }else{
        db.collection("chat").get().then((query)=>{
            var index = ""
            const ubicacion = query.docs.length + 1

            if(ubicacion < 10) {
                index = "0" + ubicacion
            }else{
                index = ubicacion.toString()
            } 
            // Agregar el documento a Firestore con los datos proporcionados
            db.collection("chat").add({
                mensaje: mensaje,
                nombre: nombreUser,
                index: index,
                fecha: moment().format('MMMM D YYYY, h:mm:ss a')
            })
                          
        }).then(() => {
            // Limpiar el campo de entrada después de enviar el mensaje
            mensajeInput.value = "";
        }) .catch((error) => {
            console.error("Error al enviar mensaje:", error);
        }) 
    }
}

function recuperar(){
  const email = document.getElementById("loginName").value
  var auth = firebase.auth()

  auth.sendPasswordResetEmail(email).then(()=>{
    alert("Enviamos un correo con el link de RECUPERAR SU CONTRASEÑA")
  }).catch((error)=>{
    alert("Su Email no esta REGISTRADO")
  })
}