import { Component, OnInit } from '@angular/core'
import { DataTablesModule } from 'angular-datatables'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ContentsService } from '../services/contents.service'
import { Observable } from 'rxjs/Observable'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ajaxDelete } from 'rxjs/observable/dom/AjaxObservable'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg'
import { Http } from '@angular/http'
import * as decode from 'jwt-decode'
declare var bootbox:any
declare var froalaEditor: any

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
  contentsForm: FormGroup
  contentId: string = null
  title: string = null
  description: string = null
   
      
  constructor(private http: HttpClient, private contentsservice: ContentsService, private contentForm: FormBuilder) { }

  ngOnInit() {
    
    this.contentList()

    this.contentsForm = this.contentForm.group({
      content_id:[''],
      title:['', [ Validators.required]],
      description:['', [Validators.required]]
    });
   
    
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
            var html
            html = `<a title="Edit" class="editbutton" contents-id="${data._id}" contents-title="${data.title}" contents-description="${btoa(data.description)}"><i class="fa fa-pencil-square-o fa-2x"></i>Edit</a>`
                   if(data.active == 1)
                        html += ` <a title="InActivate" class="deletebutton activeContent" contents-id="${data._id}" contents-flag="0"><i class="fa fa-check-circle fa-2x"></i> InActivate</a>`
                   else
                        html += ` <a title="Activate" class="deletebutton inactiveContent" contents-id="${data._id}" contents-flag="1"><i class="fa fa-check-circle fa-2x"></i> Activate</a>`
            return html
              
          },
          "orderable": false
      }
    ],
    
    }

    document.querySelector('body').addEventListener('click', (event)=> {
      let target = <Element>event.target; // Cast EventTarget into an Element
      if (target.tagName.toLowerCase() == 'a' && $(target).hasClass('editbutton')) {
        this.contentId = target.getAttribute('contents-id')
        this.title = target.getAttribute('contents-title')
        this.description = atob(target.getAttribute('contents-description'));       
        (<any>$('#content-add')).modal('show')
      }

      if (target.tagName.toLowerCase() == 'a' && $(target).hasClass('closeForm')) {
        this.contentsForm.reset()
      }
      if (target.tagName.toLowerCase() == 'a' && $(target).hasClass('close')) {
            this.contentsForm.reset()
      }      

      if (target.tagName.toLowerCase() == 'a' && $(target).hasClass('deletebutton')) {
        let contentId = target.getAttribute('contents-id');
        let flag = target.getAttribute('contents-flag');
        var msg = 'Activate'
        if(flag == '0')
            msg = 'InActivate'
        bootbox.confirm("Are you sure want to "+ msg +" this content?", (result)=> {
            if(result){
                  this.contentsservice.deleteContent(contentId, flag)
                    .subscribe(res => {
                      if(res['statusCode'] == 200) {
                        $('#ajaxResults').addClass('alert alert-success').html('Content '+ msg +' successfully') ;
                          setTimeout(function() {
                               $('#ajaxResults').removeClass('alert alert-success').html('');
                             }, 2000);
                        var table = $('#contents-list').DataTable();
                        table.ajax.reload(null, false);
                      }
                }, err => {
                  $('#ajaxResults').addClass('alert alert-danger').html('Sorry for the inconvenience. Please try again later.') ;
                  setTimeout(function() {
                       $('#ajaxResults').removeClass('alert alert-danger').html('');
                     }, 2000);            
                });
             }
        })
      }
      
    })
      
  }

  saveDetails(){
    let contentId = this.contentsForm.value.content_id
    if(contentId != null){
      //console.log("inside component:" + userId)
        this.contentsservice.updateContent(this.contentsForm.value, contentId)
        .subscribe( response => {
          if(response['statusCode'] == 200) {
          this.contentsForm.reset();
          (<any>$('#content-add')).modal('hide')
          $('#ajaxResults').addClass('alert alert-success').html('Content updated successfully') 
            setTimeout(function() {
                $('#ajaxResults').removeClass('alert alert-success').html('')
              }, 2000);
          var table = $('#contents-list').DataTable()
          table.ajax.reload(null, false);
        }
      },
      error => {
        this.error = true
      })
    }else{
      this.contentsservice.addContent(this.contentsForm.value)
      .subscribe(
        response => {
            if(response['statusCode'] == 200) {
            this.contentsForm.reset();
            (<any>$('#content-add')).modal('hide')
            $('#ajaxResults').addClass('alert alert-success').html('Content added successfully') 
              setTimeout(function() {
                  $('#ajaxResults').removeClass('alert alert-success').html('')
                }, 2000);
            var table = $('#contents-list').DataTable()
            table.ajax.reload(null, false);
          }
        },
        error => {
          this.error = true
        })
    } 
   
  } 


}
