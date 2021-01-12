import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Footer from '../Footer';
import DragMod  from './dragDropModule/dragModule';
import TableMod from './table/table'

const style = {
    heading: {
        "widht": '100%',
        "text-align": 'center',
        'font-weight': '600',
        'margin-top': '24px'
    }
} 

class BrainSubmitPortal extends React.Component {
    constructor(props) {
        super(props);
        // console.log('data',this.props)
        this.state = {
            isMobile: true,
            isDragMod: false,
            files: '',
            list: [],
        };
    }
    componentDidMount=()=>{
        var values = [];
    }

    handleUpLoadedFiles = (files)=>{
        console.log('handleUpLoadedFiles',files);
        // console.log('files',files);
        this.setState({files: [],isDragMod: false})
        for(var i =0; i < files.length; i++){
            let file = this.getUploadFileExtension3(files[i].path);
            // console.log('file',file)
            if(file === 'json' || file === 'csv'){
                this.setState(prevState => ({
                    files: prevState.files.concat(files[i])
                }))
                this.handleFileSelect(files[i], file, i)
            }else{
                alert(file);
            }
        }
    }

    getUploadFileExtension3 = (url) =>{
        if(new RegExp(".json").test(url)){
            return "json";
        }else if(new RegExp(".csv").test(url)){
            return "csv";
        }else{
            return `${url.split('.').pop()} file not supported`;
        }
    }



    handleFileSelect = (file, fileType, key)=> {
        let reader = new FileReader();
        let the  = this;
        reader.onload = function(e) {
            if(fileType === 'json'){
                let data = JSON.parse(e.target.result);
                data = data[0]
                console.log('data',data)
                if(data && data.player){
                    the.setState(prevState => 
                        ({
                            list: prevState.list.concat({
                                key:key,
                                name:data.player['first-name'] +' '+ data.player['last-name'], 
                                position:data.player['position'], 
                                team:data.player['team'], 
                            })
                        }) 
                    );
                }else{
                    alert(`${file.name} file data farmat invalid.`);
                }
            }else{
                the.setState(prevState => 
                    ({
                        list: prevState.list.concat({
                            key:key,
                            name: 'unknown', 
                            position: 'unknown', 
                            team: 'unknown', 
                        })
                    }) 
                );
            }
          // that.displayData(e.target.result);
        };
        reader.readAsText(file);
    }

    handleRemoveFile =(key)=>{
        // key = key.toString();
        let file  = this.state.files;
        var newfile = [];
        this.setState({files: []})
        for(var i = 0; i < file.length; i++){
            if(i !== key){
                console.log('i',file[i])
                newfile.push(file[i]);
                // this.setState(prevState => ({
                //     files: prevState.files.concat(file[i])
                // }))
            }else{
                console.log('file deleted')
            }
        }
        console.log('remove file',newfile);
        this.setState({files: newfile})
        setTimeout(()=>{
            this.setList()
        },500)
    }
    setList =()=>{
        const { files } = this.state;
        console.log('files',files)
        this.setState({list : []})
        for(var i =0; i < files.length; i++){
            this.handleFileSelect(files[i], files[i].name.split('.').pop(), i)
        }
    }

    render() {
        const { isDragMod, list, files } = this.state;

        return (
            <> 
                <div
                    ref="rosterContainer"
                    className={this.state.isMobile ? "container t-roster container_1200 animated1 zoomIn1 team-admin-page-navigation bottom-margin" : "container t-roster container_1200 animated1 zoomIn1 team-admin-page-navigation"}
                >
                    <div className="row" >
                        <div className="col-md-12"> 
                            {/*-- heading --*/}
                                <h1 style={ style.heading }>Brain Simulation Portal</h1>
                            {/*-- Back button --*/}
                                <Button onClick={() => this.props.makeVisible(false)} >&lt; Back</Button>
                            {/*-- Back button end --*/}
                            
                            {/*-- Body --*/}
                                <Row>
                                    <Col sm={12} className="upload-sensor-data-button">
                                        {!isDragMod && !list[0] ?
                                            <Button onClick={()=>this.setState({isDragMod: true})}>Upload Sensor Data</Button>
                                            : ''
                                        }
                                    </Col>
                                    <Col sm={12}>
                                        {/*-- Drop Zone --*/}
                                        {isDragMod && 
                                            <div className="drag-drop-component">
                                                <DragMod handleUpLoadedFiles={this.props.handleUpLoadedFiles ? this.props.handleUpLoadedFiles : this.handleUpLoadedFiles} />
                                            </div>
                                        }
                                        {/*-- Drop Zone end--*/}

                                        {/*-- File List table --*/}
                                            {list[0] && 
                                                <div style={{'width':'80%','margin':'auto'}}>
                                                    <div className="simulation-file-list-header">
                                                        <p>{files.length} simulation uploaded</p>
                                                        <p>Would you like to use the coarse mesh or fine mesh? <Form.Check inline label="Coarse" />  <Form.Check inline label="Fine" /></p>
                                                        <p>Estimated Cost: </p>
                                                    </div>
                                                    {/*-- Table --*/}
                                                    <div>
                                                        <h3 style={{'text-align':'center'}}>Remove any unwanted simulations</h3>
                                                        <TableMod list={list} handleRemoveFile={this.props.handleRemoveFile ? this.props.handleRemoveFile : this.handleRemoveFile }/>
                                                    </div>
                                                    <div style={{'text-align':'center'}}>
                                                        <Button variant="success"> Submit </Button>
                                                    </div>
                                                </div>
                                            }
                                        {/*-- File List end --*/}
                                    </Col>
                                </Row>
                            {/*-- Body end --*/}
                        </div>
                    </div>
                </div>

                <div style={this.state.isMobile ? {
                    position: "absolute",
                    width: "100%",
                    bottom: '0'
                } : {}}>
                    <Footer/>
                </div>
            </>
        );
    }
}

export default BrainSubmitPortal;
