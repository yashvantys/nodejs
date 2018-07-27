import { Component, OnInit } from '@angular/core'
import { DataTablesModule } from 'angular-datatables'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ContentsService } from '../services/contents.service'
import { Observable } from 'rxjs/Observable'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ajaxDelete } from 'rxjs/observable/dom/AjaxObservable'
import { Http } from '@angular/http'
import * as decode from 'jwt-decode'
declare var bootbox:any

class ContentsData {
  _id: string
  title: string
  description: string  
}
class DataTablesResponse {
  data: any[]
  draw: number
  recordsFiltered: number
  recordsTotal: number
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  dtOptions: DataTables.Settings = {}
  path = environment.path 
  error:boolean = false
  contentsdata: ContentsData[]
  dataTable: any
  constructor(private http: HttpClient, private contentsservice: ContentsService) { }

  ngOnInit() {
    this.contentList()
  }

  contentList(){
    this.dtOptions = {
      responsive: true,
      pageLength:10,
      lengthChange:false,
      serverSide: true,
      processing: true,
      searching: true,                
      "language": {
        "emptyTable": "No data available in Content Management",
        "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
      },
     order : [[0, 'asc']],           
    ajax: (dataTablesParameters: any, callback) => {
        this.http
            .post<DataTablesResponse>(this.path+ '/contents', dataTablesParameters)
            .map((resp: any) => resp)
            .subscribe((resp: any) => {
                this.contentsdata = resp.contents                                                                       
                callback({
                    recordsTotal: resp.recordsTotal,
                    recordsFiltered: resp.recordsTotal,
                    data: this.contentsdata,
                })
            })
    },
    columns: [
        { data: "title" },
        {
          data: null, render: function (data, type, row) {
              return `<button type="button" class="btn btn-primary editbutton">Edit</button>
                            <button type="button" class="btn btn-danger deletebutton" contents-id="${data._id}">Delete</button>`                            
              
              
          },
          "orderable": false
      }
    ],
}
  }
}
