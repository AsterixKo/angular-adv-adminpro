import { RouterLink } from "@angular/router";

export class Usuario {

    // Colocamos los opcionales al final
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string) {
    }
}