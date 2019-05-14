import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup = null;
  initArr: any[] = [[1, 1, 0], [2, 1, 3], [3, 1, 1]];
  result: any = null

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      matrix: this.fb.array([])
    })
    const matrix = <FormArray>this.form.controls['matrix'];
    for (let i = 0; i < this.initArr.length; i++) {
      let row = this.fb.array([]);
      for (let j = 0; j < this.initArr[i].length; j++) {
        const num = this.fb.control(this.initArr[i][j]);
        row.push(num);
      }
      matrix.push(row);
    }

  }

  onSubmit() {
    this.result = null;
    const url = `${environment.apiUrl}/calculate`;
    this.http.post(url, { array: this.form.value.matrix })
      .subscribe((res: { code: number, results: any }) => {
        if (res.code === 200) {
          this.result = res.results;
        }
      })
  }

  addRow() {
    const matrix = <FormArray>this.form.controls['matrix'];
    let row = this.fb.array([]);
    for (let i = 0; i < (matrix.controls[0] as FormArray).controls.length; i++) {
      const num = this.fb.control(1);
      row.push(num);
    }
    matrix.push(row);
  }

  removeRow() {
    const matrix = <FormArray>this.form.controls['matrix'];
    (this.form.get('matrix') as FormArray).removeAt(matrix.controls.length - 1);
  }

  addColumn() {
    const matrix = <FormArray>this.form.controls['matrix'];;
    for (let row of matrix.controls) {
      (row as FormArray).push(this.fb.control(1));
    }
  }

  removeColumn() {
    const matrix = <FormArray>this.form.controls['matrix'];;
    for (let row of matrix.controls) {
      (row as FormArray).removeAt((row as FormArray).controls.length - 1);
    }
  }


}
