//modelo del alumno
export interface Alumno {
    id: string,
    correo: string,
    nombre: string,
    apellido: string,
    contrasena: string,
    contacto: string,
    role: string
}

export interface Vehiculo {
    id: string,
    patente: string,
    color: string,
    capacidad: number
}

export interface Viaje {
    id: string,
    nombre: string,
    contacto: string,
    capacidad: number,
    patente: string,
    lugar: string,
    precio: number,
    idP: string[],
    pasajero: string[]
}