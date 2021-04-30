import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, VFC } from "react";
import { Api } from "../../lib/Api";

type FieldType = Field["type"];

interface BaseField {
  name: string;
}

interface TextField extends BaseField {
  type: "text";
}

interface SelectField extends BaseField {
  type: "select";
  options: string[];
}

type Field = TextField | SelectField;

function createInitialField(type: FieldType, name = ""): Field {
  switch (type) {
    case "select":
      return { type, name, options: [""] };
    case "text":
    default:
      return { type, name };
  }
}

function useFields(initialFields: Field[] = []) {
  const [fields, setFields] = useState(initialFields);

  return {
    fields,
    add() {
      setFields((fields) => [...fields, createInitialField("text")]);
    },
    changeType(index: number, type: FieldType) {
      setFields((fields) =>
        fields.map((field, i) =>
          i === index ? createInitialField(type, field.name) : field
        )
      );
    },
    setProps(index: number, props: Field) {
      setFields((fields) =>
        fields.map((field, i) =>
          i === index ? ({ ...props, type: field.type } as Field) : field
        )
      );
    },
    remove(index: number) {
      setFields((fields) => fields.filter((_, i) => i !== index));
    },
  };
}

const Types = ["text", "select"] as const;
const FieldTypeSelector: VFC<{
  field: Field;
  onTypeChange: (type: FieldType) => void;
}> = ({ field, onTypeChange }) => {
  return (
    <select
      value={field.type}
      onChange={(e) => onTypeChange(e.target.value as FieldType)}
    >
      {Types.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
};

const TextFieldInput: VFC<{
  field: TextField;
  onChange: (field: TextField) => void;
}> = () => {
  return null;
};

const SelectFieldInput: VFC<{
  field: SelectField;
  onChange: (field: SelectField) => void;
}> = ({ field, onChange }) => {
  return (
    <>
      {field.options.map((t, i) => (
        <input
          key={i}
          value={t}
          onChange={(e) =>
            onChange({
              ...field,
              options: field.options.map((o, j) =>
                i === j ? e.target.value : o
              ),
            })
          }
        />
      ))}
      <button
        onClick={() => onChange({ ...field, options: [...field.options, ""] })}
      >
        +
      </button>
    </>
  );
};

const FieldInputWrapper: VFC<{
  field: Field;
  onChange: (field: Field) => void;
}> = (props) => {
  switch (props.field.type) {
    case "select":
      return <SelectFieldInput {...(props as any)} />;
    case "text":
    default:
      return <TextFieldInput {...(props as any)} />;
  }
};

const FieldInput: VFC<{
  field: Field;
  onTypeChange: (type: FieldType) => void;
  onChange: (field: Field) => void;
  onRemove: () => void;
}> = ({ field, onTypeChange, onChange, onRemove }) => {
  return (
    <li>
      <FieldTypeSelector field={field} onTypeChange={onTypeChange} />
      <input
        value={field.name}
        onChange={(e) => onChange({ ...field, name: e.target.value })}
      />
      <FieldInputWrapper field={field} onChange={onChange} />
      <button onClick={onRemove}>x</button>
    </li>
  );
};

interface Props {
  model: { id: string; name: string; structure: Field[] };
}

const EditModel: NextPage<Props> = ({
  model: { id, name: initialName, structure: initialFields },
}) => {
  const [name, setName] = useState(initialName);
  const { fields, add, setProps, remove, changeType } = useFields(
    initialFields
  );
  const router = useRouter();

  async function saveModel() {
    await Api.withCookie().models.save(id, name, fields);
    router.push("/models");
  }

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ul>
        {fields.map((f, i) => (
          <FieldInput
            field={f}
            key={i}
            onTypeChange={(type) => changeType(i, type)}
            onChange={(f) => setProps(i, f)}
            onRemove={() => remove(i)}
          />
        ))}
      </ul>
      <button onClick={add}>add</button>
      <button onClick={saveModel}>save</button>
    </>
  );
};

EditModel.getInitialProps = async ({ req, query }) => {
  const { id } = query;
  return {
    model: await Api.withCookie(req?.headers.cookie).models.get(id as string),
  };
};

export default EditModel;
