import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {fromJS} from 'immutable';

import SettingsRecordManager from '../components/SettingsRecordManager';

import DrillstringSummary from './DrillstringSummary';
import DrillstringAttributeForm from './DrillstringAttributeForm';
import DrillstringComponentTable from './DrillstringComponentTable';

import { DRILLSTRING_DATA_TEMPLATE, METADATA } from './constants';

const DEF_MIN_ID = 0, DEF_MAX_ID =100, DEF_MIN_OD = 1, DEF_MAX_OD = 100, DEF_MIN_LENGTH = 0 ,DEF_MAX_LENGTH = 1000;
const DP_MIN_ID = 1, DP_MAX_ID =7, DP_MIN_OD = 2, DP_MAX_OD = 8, DP_MIN_LENGTH = 0 ,DP_MAX_LENGTH = 30000;
const HWDP_MIN_ID = 1, HWDP_MAX_ID =7, HWDP_MIN_OD = 2, HWDP_MAX_OD = 8, HWDP_MIN_LENGTH = 0 ,HWDP_MAX_LENGTH = 5000;
const DC_MIN_ID = 0.5, DC_MAX_ID =7, DC_MIN_OD = 2, DC_MAX_OD = 13, DC_MIN_LENGTH = 0 ,DC_MAX_LENGTH = 3000;
const STABLE_MIN_ID = 0, STABLE_MAX_ID =100, STABLE_MIN_OD = 1, STABLE_MAX_OD = 100, STABLE_MIN_LENGTH = 0 ,STABLE_MAX_LENGTH = 100;
const PDM_MIN_ID = 0, PDM_MAX_ID =12, PDM_MIN_OD = 2, PDM_MAX_OD = 13, PDM_MIN_LENGTH = 4 , PDM_MAX_LENGTH = 50;
const MWD_MIN_ID = 0, MWD_MAX_ID =12, MWD_MIN_OD = 2, MWD_MAX_OD = 13, MWD_MIN_LENGTH = 1.0 , MWD_MAX_LENGTH = 200;
const BIT_MIN_TFA = 0, BIT_MAX_TFA = 20, BIT_MIN_SIZE =1, BIT_MAX_SIZE = 100;
const PDM_MIN_STATOR = 2, PDM_MAX_STATOR = 8, PDM_MIN_ROTOR = 1, PDM_MAX_ROTOR = 7, PDM_MIN_RPG = 0, PDM_MAX_RPG = 10;

class DrillstringsApp extends Component {

  render() {    
    return <SettingsRecordManager
              asset={this.props.asset}
              convert={this.props.convert}
              recordProvider="corva"
              recordCollection="data.drillstrings"
              recordNamePlural="Drillstrings"
              recordNameSingular="Drillstring"
              recordValidator={this.validator.bind(this)}
              convertRecordBackToImperialUnit={this.convertRecordBackToImperialUnit.bind(this)}
              hideRecordSummaryInRecordEditor={false}
              title={METADATA.title}
              subtitle={METADATA.subtitle}
              recordDataTemplate={DRILLSTRING_DATA_TEMPLATE}
              RecordSummary={DrillstringSummary}
              RecordAttributeForm={DrillstringAttributeForm}
              RecordDetails={DrillstringComponentTable}
              renderRecordListItem={r => this.renderDrillstringListItem(r)} />;
  }

  renderDrillstringListItem(ds) {
    return `BHA #${ds.getIn(['data', 'id'])}`;
  }

  isValueEmpty(val) {
    if (val === null || typeof val === "undefined" || val==="") {
      return true;
    }
    return false;
  }

  isValidNumber(num,min,max) {
    num = parseFloat(num);
    if (isNaN(num)) {
      return false;
    }

    if (min && num<min) {
      return false;
    }

    if (max && num>max) {
      return false;
    }

    return true;
  }

  deriveLinearWeight(id,od) {
    return 2.673*(od*od-id*id);
  }

  isValidLinearWeight(id,od,linearWeight) {    
    let estimated = this.deriveLinearWeight(id,od);
    if (linearWeight >= estimated* 0.7 && linearWeight<= estimated*1.3) {
      return true;
    }
    return false;
  }

  validator(recordData) {
    let {data: {id, components }} = recordData.toJS();
    let shortLengthUnitDisplay = this.props.convert.getUnitDisplay('shortLength');
    let lengthUnitDisplay = this.props.convert.getUnitDisplay('length');
    let hasFormErrors = false;
    let errors = {};    
    let bitFamilyCount = 0;
    let min_id,min_od,max_id,max_od,min_length,max_length;
    errors["components"] = [];
    errors["specificErrors"] = {};

    if (this.isValueEmpty(id)) {
      errors["id"] = "It should not be empty.";
      hasFormErrors = true;
    }

    for (let i=0; i<components.length; i++) {
      let comp = components[i];
      let error = {};
      switch(comp.family) {

        case 'dp':
          min_id = this.props.convert.convertValue(DP_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DP_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DP_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DP_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DP_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DP_MAX_LENGTH,"length","ft");
          break;

        case 'hwdp':
          min_id = this.props.convert.convertValue(HWDP_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(HWDP_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(HWDP_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(HWDP_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(HWDP_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(HWDP_MAX_LENGTH,"length","ft");
          break;

        case 'dc':
          min_id = this.props.convert.convertValue(DC_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DC_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DC_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DC_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DC_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DC_MAX_LENGTH,"length","ft");
          break;

        case 'stabilizer':
          min_id = this.props.convert.convertValue(STABLE_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(STABLE_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(STABLE_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(STABLE_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(STABLE_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(STABLE_MAX_LENGTH,"length","ft");
          break;

        case 'pdm':
          min_id = this.props.convert.convertValue(PDM_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(PDM_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(PDM_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(PDM_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(PDM_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(PDM_MAX_LENGTH,"length","ft");
          break;

        case 'mwd':
          min_id = this.props.convert.convertValue(MWD_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(MWD_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(MWD_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(MWD_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(MWD_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(MWD_MAX_LENGTH,"length","ft");
          break;

        case 'bit':          
          bitFamilyCount++;
          min_id = this.props.convert.convertValue(DEF_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DEF_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DEF_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DEF_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DEF_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DEF_MAX_LENGTH,"length","ft");
          break;

        default:
          min_id = this.props.convert.convertValue(DEF_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DEF_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DEF_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DEF_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DEF_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DEF_MAX_LENGTH,"length","ft");
          break;
      }

      if (!this.isValidNumber(comp.inner_diameter,min_id,max_id)) {
        error["inner_diameter"] = `${min_id}~${max_id} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (!this.isValidNumber(comp.outer_diameter,min_od,max_od)) {
        error["outer_diameter"] = `${min_od}~${max_od} (${shortLengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (this.isValidNumber(comp.inner_diameter,min_id,max_id) && this.isValidNumber(comp.outer_diameter,min_od,max_od) && !this.isValidNumber(comp.inner_diameter,min_id,comp.outer_diameter)) {
        error["outer_diameter"] = "O.D > I.D";
        hasFormErrors = true;      
      }

      if (!this.isValidNumber(comp.length,min_length,max_length)) {
        error["length"] = `${min_length}~${max_length} (${lengthUnitDisplay})`;
        hasFormErrors = true;
      }

      if (comp.family!=='bit') { //only check validity of linear weight when family is not bit
        if (!this.isValidNumber(comp.linear_weight,0)) {
          error["linear_weight"] = "Invalid value";
          hasFormErrors = true;
        }

        if (!error["inner_diameter"] && !error["outer_diameter"] && !error["linear_weight"]) {
          if (!this.isValidLinearWeight(comp.inner_diameter,comp.outer_diameter,comp.linear_weight)) {
            error["linear_weight"] = "Invalid range";
            hasFormErrors = true;
          }
        }
      }

      if (comp.family === 'bit') {
        let specificError = {};
        if (!this.isValidNumber(comp.tfa, BIT_MIN_TFA, BIT_MAX_TFA)) {
          specificError["tfa"] = `TFA must be ${BIT_MIN_TFA}~${BIT_MAX_TFA}`;
          hasFormErrors = true;      
        }

        let bit_min_size = this.props.convert.convertValue(BIT_MIN_SIZE,"shortLength","in");
        let bit_max_size = this.props.convert.convertValue(BIT_MAX_SIZE,"shortLength","in");
        if (!this.isValidNumber(comp.size, bit_min_size, bit_max_size)) {
          specificError["size"] = `Bit size must be ${BIT_MIN_SIZE}~${BIT_MAX_SIZE}`;
          hasFormErrors = true;      
        }

        errors["specificErrors"][comp.id] = specificError;
      }

      if (comp.family==='pdm') {
        let specificError = {};
        if (!this.isValidNumber(comp.number_rotor_lobes, PDM_MIN_ROTOR, PDM_MAX_ROTOR)) {
          specificError["number_rotor_lobes"] = `It must be ${PDM_MIN_ROTOR}~${PDM_MAX_ROTOR}`;
          hasFormErrors = true;      
        }

        if (!this.isValidNumber(comp.number_stator_lobes, PDM_MIN_STATOR, PDM_MAX_STATOR)) {
          specificError["number_stator_lobes"] = `It must be ${PDM_MIN_STATOR}~${PDM_MAX_STATOR}`;
          hasFormErrors = true;      
        }

        if (!this.isValidNumber(comp.rpg, PDM_MIN_RPG, PDM_MAX_RPG)) {
          specificError["rpg"] = `It must be ${PDM_MIN_RPG}~${PDM_MAX_RPG}`;
          hasFormErrors = true;      
        }

        errors["specificErrors"][comp.id] = specificError;
      }

      errors["components"][i] = error;
    }

    if (bitFamilyCount>1) {
      errors["bit_count"] = 'Only 1 "Bit" category allowed.';
      hasFormErrors = true;
    }

    if (hasFormErrors) {
      return errors;
    }
    return null;
  }  

  convertRecordBackToImperialUnit(record) {
    let convert = this.props.convert;
    let {data} = record.toJS();
    data.start_depth = convert.convertValue(data.start_depth, "length", convert.getUnitPreference("length"),"ft");
    data.start_depth = convert.convertValue(data.end_depth, "length", convert.getUnitPreference("length"),"ft");
    data.components.map((component)=>{
      component.inner_diameter = convert.convertValue(component.inner_diameter, "shortLength", convert.getUnitPreference("shortLength"),"in");
      component.outer_diameter = convert.convertValue(component.outer_diameter, "shortLength", convert.getUnitPreference("shortLength"),"in");
      if (component.linear_weight) { // bit family doesn't have linear weight
        component.linear_weight = convert.convertValue(component.linear_weight, "force", convert.getUnitPreference("force"),"lbf");
      }
      component.weight = convert.convertValue(component.weight, "mass", convert.getUnitPreference("mass"),"lb");
      component.length = convert.convertValue(component.length, "length", convert.getUnitPreference("length"),"ft");
      if (component.family === 'bit') {
        component.size = convert.convertValue(component.size, "shortLength", convert.getUnitPreference("shortLength"),"in");
      }
      return component;
    });

    return record.set("data", fromJS(data));    
  }
}

DrillstringsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DrillstringsApp;
