document.addEventListener('DOMContentLoaded', function () {
    //===============================================================================
    //UTILIDADES
    function obtenerPersonas(almacenamiento) {
        if (almacenamiento === 'localStorage') {
            return JSON.parse(localStorage.getItem('personas')) || [];
        } else if (almacenamiento === 'sessionStorage') {
            return JSON.parse(sessionStorage.getItem('personas')) || [];
        }
        return [];
    }

    function guardarPersonas(almacenamiento, personas) {
        if (almacenamiento === 'localStorage') {
            localStorage.setItem('personas', JSON.stringify(personas));
        } else if (almacenamiento === 'sessionStorage') {
            sessionStorage.setItem('personas', JSON.stringify(personas));
        }
    }

    function mostrarBotonesModificarEliminar(mostrar) {
        document.getElementById('btnModificar').style.display = mostrar ? 'block' : 'none';
        document.getElementById('btnEliminar').style.display = mostrar ? 'block' : 'none';
    }

    function limpiarFormulario() {
        document.getElementById('formularioPersonas').reset();
        mostrarBotonesModificarEliminar(false);
    }

    //===============================================================================
    //BUSCAR PERSONA
    function buscarPersona(almacenamiento, cedula) {
        const personas = obtenerPersonas(almacenamiento);
        return personas.find(persona => persona.cedula === cedula);
    }

    function cargarDatosEnFormulario(persona) {
        if (!persona) return;
        document.getElementById('cedulaPersona').value = persona.cedula;
        document.getElementById('nombresPersona').value = persona.nombres;
        document.getElementById('apellidosPersona').value = persona.apellidos;
        document.getElementById('fechaNacimiento').value = persona.fechaNacimiento;
        document.getElementById('direccionPersona').value = persona.direccion;
        document.getElementById('telefonoPersona').value = persona.telefono;
        document.getElementById('emailPersona').value = persona.email;
        mostrarBotonesModificarEliminar(true);
    }

    document.getElementById('btnBuscar').addEventListener('click', function (event) {
        event.preventDefault();
        const cedulaBusqueda = document.getElementById('cedulaPersona').value;
        const almacenamiento = document.getElementById('almacenamiento').value;
        const persona = buscarPersona(almacenamiento, cedulaBusqueda);
        if (persona) {
            cargarDatosEnFormulario(persona);
        } else {
            alert('Persona no encontrada');
        }
    });

    //===============================================================================
    //MODIFICAR PERSONA
    function modificarPersona(almacenamiento) {
        const cedula = document.getElementById('cedulaPersona').value;
        const personas = obtenerPersonas(almacenamiento);
        const index = personas.findIndex(persona => persona.cedula === cedula);
        if (index !== -1) {
            personas[index] = {
                cedula,
                nombres: document.getElementById('nombresPersona').value,
                apellidos: document.getElementById('apellidosPersona').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                direccion: document.getElementById('direccionPersona').value,
                telefono: document.getElementById('telefonoPersona').value,
                email: document.getElementById('emailPersona').value
            };
            guardarPersonas(almacenamiento, personas);
            alert('Persona modificada exitosamente');
            limpiarFormulario();
        } else {
            alert('Persona no encontrada');
        }
    }

    document.getElementById('btnModificar').addEventListener('click', function (event) {
        event.preventDefault();
        const almacenamiento = document.getElementById('almacenamiento').value;
        modificarPersona(almacenamiento);
    });

    //===============================================================================
    //ELIMINAR PERSONA
    function eliminarPersona(almacenamiento) {
        const cedula = document.getElementById('cedulaPersona').value;
        let personas = obtenerPersonas(almacenamiento);
        const index = personas.findIndex(persona => persona.cedula === cedula);
        if (index !== -1) {
            personas.splice(index, 1);
            guardarPersonas(almacenamiento, personas);
            alert('Persona eliminada exitosamente');
            limpiarFormulario();
        } else {
            alert('Persona no encontrada');
        }
    }

    document.getElementById('btnEliminar').addEventListener('click', function (event) {
        event.preventDefault();
        const almacenamiento = document.getElementById('almacenamiento').value;
        eliminarPersona(almacenamiento);
    });

    //===============================================================================
    //AGREGAR PERSONA
    function cargarDatosPersona(almacenamiento) {
        const cedula = document.getElementById('cedulaPersona').value;
        const nombres = document.getElementById('nombresPersona').value;
        const apellidos = document.getElementById('apellidosPersona').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const direccion = document.getElementById('direccionPersona').value;
        const telefono = document.getElementById('telefonoPersona').value;
        const email = document.getElementById('emailPersona').value;

        if (!isValidCedula(cedula)) {
            alert('Cédula no válida');
            return;
        }

        if ([nombres, apellidos, fechaNacimiento, direccion, telefono, email].some(field => field === '')) {
            alert('Complete todos los campos');
            return;
        }

        const nuevaPersona = { cedula, nombres, apellidos, fechaNacimiento, direccion, telefono, email };
        const personas = obtenerPersonas(almacenamiento);
        personas.push(nuevaPersona);
        guardarPersonas(almacenamiento, personas);
        limpiarFormulario();
    }

    document.getElementById('btnAgregar').addEventListener('click', function (event) {
        event.preventDefault();
        const almacenamiento = document.getElementById('almacenamiento').value;
        cargarDatosPersona(almacenamiento);
        alert('Persona agregada exitosamente');
    });

    //===============================================================================
    //LISTAR PERSONAS
    function listarPersonas(personas) {
        const tbody = document.querySelector('#tablaPersonas tbody');
        tbody.innerHTML = '';
        personas.forEach((persona, index) => {
            const fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${persona.cedula}</td>
                    <td>${persona.nombres}</td>
                    <td>${persona.apellidos}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.email}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    async function cargarDatosServidor() {
        try {
            const response = await fetch('data/personas.json');
            const data = await response.json();
            listarPersonas(data.dataPersonas);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    function cargarDatos(almacenamiento) {
        if (almacenamiento === 'servidor') {
            cargarDatosServidor();
        } else if (almacenamiento === 'localStorage') {
            listarPersonas(obtenerPersonas('localStorage'));
        } else if (almacenamiento === 'sessionStorage') {
            listarPersonas(obtenerPersonas('sessionStorage'));
        }
    }

    document.getElementById('btnListar').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('contenedorTabla').style.display = 'block';
    });

    document.getElementById('listarAlmacenamiento').addEventListener('change', function (event) {
        const almacenamiento = event.target.value;
        cargarDatos(almacenamiento);
    });

    // Inicializar datos según la selección actual al cargar la página
    cargarDatos(document.getElementById('listarAlmacenamiento').value);

    // Manejar evento click del botón de cancelar
    document.getElementById('btnCancelar').addEventListener('click', function (event) {
        event.preventDefault();
        limpiarFormulario();
    });

    //===============================================================================
    //VALIDACIÓN DE CÉDULA
    function isValidCedula(cedula) {
        if (cedula.length !== 10 || isNaN(cedula)) {
            return false;
        }
        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        const digitos = cedula.split('').map(Number);
        const verificador = digitos.pop();

        const suma = digitos.reduce((acc, digito, i) => {
            let producto = digito * coeficientes[i];
            if (producto >= 10) producto -= 9;
            return acc + producto;
        }, 0);

        const residuo = suma % 10;
        const resultado = residuo === 0 ? 0 : 10 - residuo;

        return resultado === verificador;
    }
});
