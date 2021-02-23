import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalesService } from 'src/app/services/hospitales.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor(private fb: FormBuilder,
    private hospitalService: HospitalesService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => {
      // console.log(id);
      this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    // nos subscribimos los cambios del campo hospital
    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        // console.log(hospitalId);
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
        // console.log(this.hospitalSeleccionado);
      });
  }

  cargarMedico(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico => {
        console.log(medico);

        const { nombre, hospital: { _id } } = medico;
        // console.log(nombre, _id);
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      }, error => {
        return this.router.navigateByUrl(`/dashboard/medicos`);
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    // console.log(this.medicoForm.value);
    console.log(this.medicoSeleccionado);

    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedico(data)
        .subscribe(resp => {
          console.log(resp);
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });
    } else {
      // crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          // console.log(resp);
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }

}
