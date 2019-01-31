import React, { PureComponent } from 'react';

import MappingRow from './MappingRow';
import { MappingType, ValueMapping } from '../../types/panel';
import { PanelOptionsGroup } from '../PanelOptionsGroup/PanelOptionsGroup';

export interface Props {
  valueMappings: ValueMapping[];
  onChange: (valueMappings: ValueMapping[]) => void;
}

interface State {
  valueMappings: ValueMapping[];
  nextIdToAdd: number;
}

export class ValueMappingsEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const mappings = props.valueMappings;

    this.state = {
      valueMappings: mappings,
      nextIdToAdd: mappings.length > 0 ? this.getMaxIdFromValueMappings(mappings) : 1,
    };
  }

  getMaxIdFromValueMappings(mappings: ValueMapping[]) {
    return Math.max.apply(null, mappings.map(mapping => mapping.id).map(m => m)) + 1;
  }

  addMapping = () =>
    this.setState(prevState => ({
      valueMappings: [
        ...prevState.valueMappings,
        {
          id: prevState.nextIdToAdd,
          operator: '',
          value: '',
          text: '',
          type: MappingType.ValueToText,
          from: '',
          to: '',
        },
      ],
      nextIdToAdd: prevState.nextIdToAdd + 1,
    }));

  onRemoveMapping = (id: number) => {
    this.setState(
      prevState => ({
        valueMappings: prevState.valueMappings.filter(m => {
          return m.id !== id;
        }),
      }),
      () => {
        this.props.onChange(this.state.valueMappings);
      }
    );
  };

  updateGauge = (mapping: ValueMapping) => {
    this.setState(
      prevState => ({
        valueMappings: prevState.valueMappings.map(m => {
          if (m.id === mapping.id) {
            return { ...mapping };
          }

          return m;
        }),
      }),
      () => {
        this.props.onChange(this.state.valueMappings);
      }
    );
  };

  render() {
    const { valueMappings } = this.state;

    return (
      <PanelOptionsGroup title="Value Mappings">
        <div>
          {valueMappings.length > 0 &&
            valueMappings.map((valueMapping, index) => (
              <MappingRow
                key={`${valueMapping.text}-${index}`}
                valueMapping={valueMapping}
                updateValueMapping={this.updateGauge}
                removeValueMapping={() => this.onRemoveMapping(valueMapping.id)}
              />
            ))}
        </div>
        <div className="add-mapping-row" onClick={this.addMapping}>
          <div className="add-mapping-row-icon">
            <i className="fa fa-plus" />
          </div>
          <div className="add-mapping-row-label">Add mapping</div>
        </div>
      </PanelOptionsGroup>
    );
  }
}
