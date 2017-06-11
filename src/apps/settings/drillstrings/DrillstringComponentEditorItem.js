import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Row, Col } from 'react-materialize';
import { List, Map } from 'immutable';

import { COMPONENT_FAMILIES, COMPONENT_GRADES, COMPONENT_CLASSES, COMPONENT_MATERIALS, DC_SUB_CATEGORIES, JAR_SUB_CATEGORIES } from './constants';

import './DrillstringComponentEditorItem.css';

class DrillstringComponentEditorItem extends Component {

  componentDidMount() {
    this.activateInput(["length", "weight"]);
  }

  shouldComponentUpdate(nextProps,nextState) {
    if (this.props.item!==nextProps.item) {
      return true;
    }
    return false;
  }

  render() {
    return <div className={"c-drillstring-component-editor-item "+ ((this.props.item.get('order')%2===1) ? "even":"") }>
      <Row>
        <Col m={1} s={12}>
          {this.props.dragHandle(this.renderComponentImage())}
          <div>
            <br/>
            <Button floating icon="delete" className="red" onClick={() => this.props.commonProps.onDeleteComponent(this.props.item.get('id'))}></Button>
          </div>
        </Col>
        <Col m={11} s={12}>
          {this.renderComponent()}
        </Col>
      </Row>
    </div>;
  }

  renderComponentImage() {
    return <div className={`c-drillstring-component-image
                              c-drillstring-component-image--${this.props.item.get('family')}`}>
      </div>;
  }

  renderComponent() {
    switch(this.props.item.get("family")) {
      case 'dp':
        return this.renderComponentDP();
      case 'hwdp':
        return this.renderComponentHWDP();
      case 'pdm':
        return this.renderComponentPDM();
      case 'bit':
        return this.renderComponentBIT();
      case 'dc':
        return this.renderComponentDC();
      case 'stabilizer':
        return this.renderComponentStabilizer();
      case 'sub':
        return this.renderComponentSub();
      case 'mwd':
        return this.renderComponentMWD();
      case 'jar':
        return this.renderComponentJar();
      default:
        return "";
    }
  }

  renderComponentDP() {
    return [      
      <Row key="dp-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength', 'in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength', 'in')}
        {this.renderComponentNumberField("number_of_joint", "# of Joints", 2)}
        {this.renderComponentNumberField("component_length", "Component Length", 2, "length", "ft")}
      </Row>,
      
      <Row key="dp-2">
        {this.renderComponentLabelField("length", "Total Length", 2, "length","ft")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 2, "massPerLength", "lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentSelectField('grade', "Grade", 2, COMPONENT_GRADES)}
        {this.renderComponentNumberField("tool_joint_od", "TJ OD", 2, 'shortLength', 'in')}
        {this.renderComponentNumberField("tool_joint_id", "TJ ID", 2, 'shortLength', 'in')}
      </Row>,

      <Row key="dp-3">      
        {this.renderComponentNumberField("tool_joint_length", "TJ Length per Joint", 3, "length", "ft")}
        {this.renderComponentNumberField("norminal_linear_weight", "Norminal Linear Weight", 3, "massPerLength", "lb-ft")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
        {this.renderComponentSelectField("class", "Class", 2,COMPONENT_CLASSES)}
      </Row>
    ];
  }

  renderComponentHWDP() {
    return [
      <Row key="hwdp-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint","# of Joints",2)}
        {this.renderComponentNumberField("component_length", "Component Length", 2, "length","ft")}
      </Row>,

      <Row key="hwdp-2">        
        {this.renderComponentLabelField("length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentNumberField("norminal_linear_weight", "Norminal Linear Weight", 2, "massPerLength", "lb-ft")}
        {this.renderComponentSelectField('grade', "Grade", 2, COMPONENT_GRADES)}
      </Row>,

      <Row key="hwdp-3">
        {this.renderComponentNumberField("tool_joint_od", "TJ OD", 2, 'shortLength', 'in')}
        {this.renderComponentNumberField("tool_joint_id", "TJ ID", 2, 'shortLength', 'in')}
        {this.renderComponentNumberField("tool_joint_length", "TJ Length per Joint", 2, "length", "ft")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
        {this.renderComponentSelectField("class", "Class", 2, COMPONENT_CLASSES)}
      </Row>
    ];
  }

  renderComponentPDM() {
    // should come back and add units conversion(currently unsupported by conversion.js)
    // standard_flow_range_min(max), max_wob, off_bottom_pressure_loss array
    // max_op_diff_pressure, torque_max_op_diff_pressure
    // rpm_curves-> flow rate, rpm_curves->diff_press_and_rpm-> dp 
    // rpg, kip, gpm (not supported in conversion.js), psi supported 
    return [
      <Row key="pdm-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("rpg","RPG",1)}
        {this.renderComponentNumberField("length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
      </Row>,
      
      <Row key="pdm-2">        
        {this.renderComponentNumberField("stages", "Stages", 2)}
        {this.renderComponentNumberField('number_rotor_lobes', '# of rotor lobes',2)}
        {this.renderComponentNumberField('number_stator_lobes', '# of stator lobes',2)}
        {this.renderComponentTextField("power_unit", "Power Unit", 2)}
        {this.renderComponentTextField("blend_range", "Blend Range", 2)}
        {this.renderComponentNumberField("max_wob", "Max WOB", 2)}
      </Row>,

      <Row key="pdm-3">
        <Col s={12}>
          <span style={{fontSize:"20px"}}> Standard Flow Range </span>          
        </Col>
        {this.renderComponentNumberField('standard_flow_range_min', "Min", 3)}
        {this.renderComponentNumberField('standard_flow_range_max', 'Max',3)}
      </Row>,
      
      <Row key="pdm-4">
        {this.renderComponentNumberField('max_op_diff_pressure','Max Operating Diff Pressure', 5)}
        {this.renderComponentNumberField('torque_max_op_diff_pressure', 'Torque at Max Operating Diff Pressure',5)}
      </Row>,

      <Row key="pdm-pressure-loss" className="c-drillstring-component-editor-item__obps-table">
        <Col s={12}>
          <span style={{fontSize:"20px", marginRight: "20px"}}> Off Bottom Pressure Loss </span>
          <Button floating icon="add" className="c-drillstring-component-editor__btn-sm" onClick={() => this.onAddOBPS() }></Button>
        </Col>
        <Col s={12} m={5} style={{marginTop: "10px"}}>          
          {this.props.item.get('off_bottom_pressure_loss',List([])).size > 0 &&
            <Row>
              <Col s={5}> Flow Rate(gpm) </Col>
              <Col s={5}> Pressure Loss(psi) </Col>
            </Row>
          }
          {this.props.item.get('off_bottom_pressure_loss',List([])).map((obps, index)=>            
            <Row key={index}>
              <Col s={5}>
                {this.renderOBPSNumberField(index,"flow_rate")}
              </Col>
              <Col s={5}>
                {this.renderOBPSNumberField(index,"pressure_loss")}                  
              </Col>
              <Col s={2}>
                <Button floating icon="remove" className="red c-drillstring-component-editor__btn-sm" onClick={() => this.onDeleteOBPS(index)}></Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>,

      <Row key="rpm-curves" className="c-drillstring-component-editor-item__rpm-table">
        <Col s={12}>
          <span style={{fontSize:"20px", marginRight: "20px"}}> RPM Curves </span>
          <Button floating icon="add" className="c-drillstring-component-editor__btn-sm" onClick={() => this.onAddRpmCurve()}></Button>
        </Col>
        {this.props.item.get('rpm_curves',List([])).map((rpmCurve, rpmCurveIndex)=> 
          this.renderRpmCurve(rpmCurve,rpmCurveIndex)
        )}
      </Row>

    ];
  }

  renderComponentBIT() {
    return [
      <Row key="bit-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 4)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("weight", "Total Weight", 2, "mass","lb")}
      </Row>,

      <Row key="bit-nozzles" className="c-drillstring-component-editor-item__nozzle-table">
        <Col s={12} m={8} l={4}>
          <div>
            <span style={{fontSize:"20px", marginRight: "20px"}}> Nozzle Sizes</span>
            <Button floating icon="add" className="c-drillstring-component-editor__btn-sm" onClick={() => this.onAddNozzle()}></Button>
          </div>
          {this.props.item.get('nozzle_sizes',List([])).size > 0 &&
            <Row>
              <Col s={5}> Nozzle Size </Col>
              <Col s={5}> # of this size </Col>
            </Row>
          }
          {this.props.item.get('nozzle_sizes',List([])).map((nozzle, index)=> 
            <Row key={index}>
              <Col s={5}>
                {this.renderNozzleNumberField(index,"size")}
              </Col>
              <Col s={5}>
                {this.renderNozzleNumberField(index,"count")}
              </Col>
              <Col s={2}>
                <Button floating icon="remove" className="red c-drillstring-component-editor__btn-sm" onClick={() => this.onDeleteNozzle(index)}></Button>                
              </Col>
            </Row>
          )}
        </Col>        
      </Row>,

      <Row key="bit-3">
        {this.renderComponentTextField("shank_od", "Shank OD", 2)}
        {this.renderComponentTextField("make", "Make", 2)}
        {this.renderComponentTextField("serial_number", "Serrial Number", 2)}
        {this.renderComponentTextField("model", "Model", 2)}
        {this.renderComponentNumberField("tfa", "TFA", 2)}
      </Row>
    ];
  }

  renderComponentDC() {
    return [
      <Row key="dc-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentSelectField('sub_category', "Sub Category", 2, DC_SUB_CATEGORIES)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint","# of Joints",2)}
      </Row>,

      <Row key="dc-2">
        {this.renderComponentNumberField("component_length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 2 ,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
      </Row>   
    ];
  }

  renderComponentSub() {
    return [
      <Row key="sub-1">
        {this.renderComponentSelectField('family', "Category", 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 3)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("component_length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 2,"length","ft")}
        
      </Row>,

      <Row key="sub-2">
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 3,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 3, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 3)}
        {this.renderComponentSelectField('material', "Material", 3, COMPONENT_MATERIALS)}
      </Row>
    ];
  }

  renderComponentStabilizer() {
    return [
      <Row key="stabilizer-1">
        {this.renderComponentSelectField('family', "Category", 2 , COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("component_length", "Component Length", 2, "length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 2, "length","ft")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight",2, "massPerLength","lb-ft")}        
      </Row>,

      <Row key="stabilizer-2">
        {this.renderComponentLabelField("weight", "Total Weight", 1, "mass","lb")}
        {this.renderComponentNumberField("gauge_od", "Gauge OD", 1, "shortLength", "in")}
        {this.renderComponentNumberField("gauge_length", "Gauge Length", 2, "length", "ft")}
        {this.renderComponentNumberField("no_of_blades", "# of Blades", 2)}
        {this.renderComponentNumberField("blade_width", "Blade Width", 2, "length", "ft")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
      </Row>   
    ];
  }

  renderComponentJar() {
    return [
      <Row key="jar-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentSelectField('sub_category', "Sub Category", 2, JAR_SUB_CATEGORIES)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint", "# of Joints", 2)}
        
      </Row>,
      <Row key="jar-2">
        {this.renderComponentNumberField("component_length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
      </Row>
    ];
  }

  renderComponentMWD() {
    return [
      <Row key="mwd-1">
        {this.renderComponentSelectField('family', "Category", 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("component_length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 2,"length","ft")}                
      </Row>,

      <Row key="mwd-2">
        {this.renderComponentNumberField("linear_weight", "Adjust Linear Weight", 3,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', "Material", 2, COMPONENT_MATERIALS)}
      </Row>   
    ];
  }

  renderComponentNumberField(field, label, colSize, unitType=null, unit=null) {
    let value = this.props.item.get(field) || '';
    if (field === 'number_of_joint') {
      value = 1;
    }

    let numberFormat;

    if (value!=='' && unitType && unit) {
      numberFormat='0.00';
      value = this.props.commonProps.convert.convertValue(value,unitType,unit);
    };
    
    if (value!=='' && !unitType && !unit) {
      numberFormat='0';
    }

    if (field === 'tfa')  {
      numberFormat = '0.00';
    }

    if (numberFormat && value.formatNumeral) {
      value = value.formatNumeral(numberFormat);
    }
    
    let errors = this.props.commonProps.errors;
    let compId = this.props.item.get('id');
    return <Input type="number"
                  label={label}
                  m={colSize}
                  s={12}                  
                  defaultValue={value}
                  error={errors && errors[compId] && errors[compId][field]? errors[compId][field]: null}
                  ref={field}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={e => this.onNumberFieldChange.bind(this)(field,parseFloat(e.target.value))} />;    
  }

  renderComponentTextField(field, label="", colSize=2) {    
    return <Input type="text"                  
                  label={label}
                  m={colSize}
                  s={12}
                  defaultValue={this.props.item.get(field, '')}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={e => this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), field, e.target.value)} />;
  }

  renderComponentSelectField(field, label, colSize=2, options) {    
    return <Input type="select"
                  label={label}
                  m={colSize}
                  s={12}
                  defaultValue={this.props.item.get(field, '')}
                  onChange={e => { setTimeout(_=> {this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), field, e.target.value);}, 0); }}>
      {this.props.item.get('field')!=="family" && <option value="">Choose</option>}
      {options.map(({name, type}) =>
        <option key={type} value={type} className="grey" style={{backgroundColor:"#000"}}>{name}</option>)}
    </Input>;
  }

  renderComponentLabelField(field,label="",colSize=2,unitType,unit) {
    let value = this.props.item.get(field) || '';    
    let numberFormat;
    if (!isNaN(value)) {
      if (unitType && unit) {
        numberFormat='0.00';
        value = this.props.commonProps.convert.convertValue(value,unitType,unit);
      };
      
      if (!unitType && !unit) {
        numberFormat='0';
      }

      if (field === 'tfa')  {
        numberFormat = '0.00';
      }
    }

    if (numberFormat && value.formatNumeral) {
      value = value.formatNumeral(numberFormat);
    }

    let errors = this.props.commonProps.errors;
    let compId = this.props.item.get('id');

    return <Input type="number"
                  label={label}
                  m={colSize}
                  s={12}
                  value={value}
                  disabled
                  className="disabled-input"
                  error={errors && errors[compId] && errors[compId][field]? errors[compId][field]: null}
                  ref={field} />;

    /*return <Col m={colSize} s={12}>
      {errors && errors[compId] && errors[compId][field]?
        <label style={{color:"red"}}>{errors[compId][field]}</label>:
        <label>{label}</label>
      }
      <br/>      
      <label>{value!=='' ? value: "N/A"}</label>
      
    </Col>;*/
  }

  renderNozzleNumberField(index,key) {
      return <Input type="number"
                s={12}
                defaultValue={this.props.item.getIn(["nozzle_sizes",index,key])}
                onChange={e => this.onNozzleValueChange(index, key, parseFloat(e.target.value))} />;
  }

  renderOBPSNumberField(index,key) {
      return <Input type="number"                
                s={12}
                defaultValue={this.props.item.getIn(["off_bottom_pressure_loss",index,key])}
                onChange={e => this.onOBPSValueChange(index, key, parseFloat(e.target.value))} />;
  }

  renderRpmCurve(rpmCurve,rpmCurveIndex) {
    return <Col m={6} l={3} key={rpmCurveIndex}>
      <Row>
        <Input type="number"
          s={10}
          label="Flow rate"
          defaultValue={rpmCurve.get('flow_rate')}
          onChange={e => this.onRpmCurveFlowRateChange(rpmCurveIndex, "flow_rate", parseFloat(e.target.value))} />
        <Col s={2}>
          <Button floating icon="delete" className="red c-drillstring-component-editor__btn-sm" onClick={() => this.onRemoveRpmCurve(rpmCurveIndex)}></Button> 
        </Col>
      </Row>
      <br/>
      <Row>
        <Col s={5}> Diff Press </Col>
        <Col s={5}> RPM </Col>
        <Col s={2}> <Button floating icon="add" className="c-drillstring-component-editor__btn-sm" onClick={() => this.onAddDPRPM(rpmCurve,rpmCurveIndex)}></Button> </Col>
      </Row>
      {rpmCurve.get('diff_press_and_rpm',List([])).map((dprpm, dprpmIndex)=> 
        <Row key={dprpmIndex}>
          <Col s={5}>
            <Input type="number"
              m={12}
              defaultValue={dprpm.get('dp')}
              onChange={e => this.onDPRPMChange(rpmCurve,rpmCurveIndex, dprpmIndex, "dp", parseFloat(e.target.value))} />
          </Col>
          <Col s={5}>
            <Input type="number"
              m={12}
              defaultValue={dprpm.get('rpm')}
              onChange={e => this.onDPRPMChange(rpmCurve,rpmCurveIndex, dprpmIndex, "rpm", parseFloat(e.target.value))} />
          </Col>
          <Col s={2}> 
            <Button floating icon="remove" className="red c-drillstring-component-editor__btn-sm" onClick={() => this.onRemoveDPRPM(rpmCurve,rpmCurveIndex,dprpmIndex)}></Button> 
          </Col>
        </Row>
      )}
      
    </Col>;
  }

  calcLinearWeight(id,od) {
    id = parseFloat(id);
    od = parseFloat(od);
    if (isNaN(id) || isNaN(od) || od<id) {
      return;
    }
    return 2.673*(od*od-id*id);
  }

  calcWeight(linearWeight,length) {
    linearWeight = parseFloat(linearWeight);
    length = parseFloat(length);
    if (isNaN(linearWeight) || isNaN(length)) {
      return;
    }
    return linearWeight*length;
  }

  calcLength(noJoint,component_length) {
    noJoint = parseFloat(noJoint);
    component_length = parseFloat(component_length);
    if (isNaN(noJoint) || isNaN(component_length)) {
      return;
    }
    return noJoint*component_length; 
  }

  onNumberFieldChange(field,value) {
    const component = this.props.item;
    const family = component.get('family');
    let id,od,linearWeight,noJoint,componentLength,length,weight;
    let nameValuePairs=[];
    switch(field) {
      case 'inner_diameter':
        if (family === 'bit' || family==='pdm') 
          break;
        id = value;
        od = component.get('outer_diameter');        
        linearWeight = this.calcLinearWeight(id,od);
        length = component.get('length');
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'outer_diameter':
        if (family === 'bit' || family==='pdm')
          break;
        id = component.get('inner_diameter');
        od = value;
        linearWeight = this.calcLinearWeight(id,od);
        length = component.get('length');
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'linear_weight':
        length = component.get('length');
        weight = this.calcWeight(value,length);
        break;
      case 'number_of_joint':
        if (family === 'bit' || family==='pdm') 
          break;
        componentLength = component.get('component_length');
        length = this.calcLength(value,componentLength);
        linearWeight = component.get('linear_weight');
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'component_length':
        if (family === 'bit' || family==='pdm') 
          break;
        noJoint = component.get('number_of_joint',1);
        length = this.calcLength(noJoint,value);
        linearWeight = component.get('linear_weight');
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'length':
        if (family !== 'pdm') 
          break;
        weight = component.get('weight');
        if (weight && !isNaN(weight)) {
          linearWeight = weight / value;
        }
        break;
      case 'weight':
        if (family !== 'pdm') 
          break;
        length = component.get('length');
        if (length && !isNaN(length)) {
          linearWeight = value / length;
        }
        break;
      default:
        break;        
    }

    nameValuePairs=[{name:field,value}];

    if (linearWeight>=0) {
      nameValuePairs.push({name:"linear_weight", value: linearWeight});
      ReactDOM.findDOMNode(this.refs.linear_weight).children[0].value = linearWeight.formatNumeral('0.00');
      this.activateInput(["linear_weight"]);      
    }

    if (length) {
      nameValuePairs.push({name:"length", value: length}); 
      this.activateInput(["length"]);
    }

    if (weight) {
      nameValuePairs.push({name:"weight", value: weight}); 
      this.activateInput(["weight"]);
    }
    
    this.props.commonProps.onComponentMultiFieldsChange(component.get('id'),nameValuePairs);
  }

  onAddNozzle() {
    let nozzle_sizes = this.props.item.get('nozzle_sizes',List([]));

    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "nozzle_sizes", nozzle_sizes.push(Map({
      size: '',
      count: ''
    })));
  }

  onDeleteNozzle(index) {
    const component = this.props.item;
    let nozzle_sizes = component.get('nozzle_sizes',List([]));
    this.props.commonProps.onComponentFieldChange(component.get('id'), "nozzle_sizes", nozzle_sizes.delete(index));
    setTimeout(_=> {
      this.onCalcTFA();
    },0);
  }

  onNozzleValueChange(index,key,val) {
    const component = this.props.item;
    const nozzle_sizes = component.get('nozzle_sizes');
    this.props.commonProps.onComponentFieldChange(component.get('id'), "nozzle_sizes", nozzle_sizes.setIn([index,key],val) );
    setTimeout(_=> {
      this.onCalcTFA();
    },0);
  }

  onCalcTFA() {
    const component = this.props.item;
    let nozzle_sizes = component.get('nozzle_sizes',List([]));
    let tfa = 4/Math.PI*nozzle_sizes.reduce((acc,nozzle)=> {
      return acc+nozzle.get('count',0)* Math.pow(nozzle.get('size',0)/32,2);      
    },0);

    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "tfa", tfa);

    ReactDOM.findDOMNode(this.refs.tfa).children[0].value = tfa.formatNumeral('0.00');
    this.activateInput(["tfa"]);
  }

  onAddOBPS() {
    let off_bottom_pressure_loss = this.props.item.get('off_bottom_pressure_loss',List([]));

    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "off_bottom_pressure_loss", off_bottom_pressure_loss.push(Map({
      flow_rate: '',
      pressure_loss: ''
    })));
  }

  onDeleteOBPS(index) {
    const component = this.props.item;
    let off_bottom_pressure_loss = component.get('off_bottom_pressure_loss',List([]));
    this.props.commonProps.onComponentFieldChange(component.get('id'), "off_bottom_pressure_loss", off_bottom_pressure_loss.delete(index));    
  }

  onOBPSValueChange(index,key,val) {
    const component = this.props.item;
    const off_bottom_pressure_loss = component.get('off_bottom_pressure_loss');
    this.props.commonProps.onComponentFieldChange(component.get('id'), "off_bottom_pressure_loss", off_bottom_pressure_loss.setIn([index,key],val) );    
  }

  onAddRpmCurve() {
    let rpm_curves = this.props.item.get('rpm_curves',List([]));
    if (rpm_curves.size<4) { // no more than 5 rpm curves
      this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "rpm_curves", rpm_curves.push(Map({
        flow_rate: '',
        diff_press_and_rpm: List([])
      })));
    }
  }

  onRpmCurveFlowRateChange(rpmCurveIndex,key,val) {
    const component = this.props.item;
    const rpm_curves = component.get('rpm_curves');
    this.props.commonProps.onComponentFieldChange(component.get('id'), "rpm_curves", rpm_curves.setIn([rpmCurveIndex,key],val) );   
  }

  onRemoveRpmCurve(rpmCurveIndex) {
    let rpm_curves = this.props.item.get('rpm_curves').delete(rpmCurveIndex);
    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "rpm_curves", rpm_curves);
  }

  onAddDPRPM(rpmCurve,rpmCurveIndex) {
      let newRpmCurve = rpmCurve.set("diff_press_and_rpm", rpmCurve.get("diff_press_and_rpm").push(Map({
        dp: '',
        rpm: ''
      })));

      let rpm_curves = this.props.item.get('rpm_curves').setIn([rpmCurveIndex], newRpmCurve);
      this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "rpm_curves", rpm_curves);
  }

  onDPRPMChange(rpmCurve, rpmCurveIndex, dprpmIndex, key, val) {
    let newRpmCurve = rpmCurve.setIn(["diff_press_and_rpm",dprpmIndex,key],val);
    let rpm_curves = this.props.item.get('rpm_curves').setIn([rpmCurveIndex], newRpmCurve);
    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "rpm_curves", rpm_curves);
  }

  onRemoveDPRPM(rpmCurve, rpmCurveIndex, dprpmIndex) {
    let newRpmCurve = rpmCurve.deleteIn(["diff_press_and_rpm",dprpmIndex]);
    let rpm_curves = this.props.item.get('rpm_curves').setIn([rpmCurveIndex], newRpmCurve);
    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "rpm_curves", rpm_curves); 
  }

  activateInput(refIds) {
    if (refIds) {
      for (let i in refIds) {
        let refDom = ReactDOM.findDOMNode(this.refs[refIds[i]]);
        refDom.children[1].className="active";
      }
    }    
    else {
      for (let ref in this.refs) {
        let refDom = ReactDOM.findDOMNode(this.refs[ref]);
        if (refDom.children[0].value === '0') {
          refDom.children[1].className="active";
        }      
      }
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.commonProps.onSave();
    }
  }

}

DrillstringComponentEditorItem.propTypes = {  
};

export default DrillstringComponentEditorItem;