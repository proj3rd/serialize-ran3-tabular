# serialize-ran3-tabular

![](https://img.shields.io/badge/support-DOCX-blue)

3GPP RAN3 tabular serializer

## Usage

```sh
npx github:proj3rd/serialize-ran3-tabular <path>
```

- `path`: An absolute or relative path to a file containing 3GPP RAN3 tabular definition.
Supports a docx file.

It writes the serialized RAN3 tabular definition to `<name>.tabular.json`,
where `<name>` is the original filename excluding a file extension.
