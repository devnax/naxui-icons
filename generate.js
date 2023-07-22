const path = require('path');
const fs = require('fs');
const HTMLParser = require('node-html-parser')

/**
 * 
 * https: //github.com/marella/material-design-icons
 * download this repo and copy the svg folder and past it in root dir
 */


const convert = async (dirname) => {
    const directory = path.join(__dirname, `node_modules/@material-design-icons/svg/${dirname}`)
    const outputDirectory = path.join(__dirname, `src/${dirname}`)
    fs.readdir(directory, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            const compName = file.replace('.svg', '').split("_").map(f => f.charAt(0).toUpperCase() + f.slice(1)).join("")
            let content = fs.readFileSync(directory + `/${file}`).toString()
            var parsed = HTMLParser.parse(content);
            const svg = parsed.querySelector("svg")
            let html = svg.innerHTML.replaceAll("xlink:href", "xlinkHref")
            const component = `import React from 'react'
import Icon, { IconProps } from '../'

const Icon${compName} = (props: IconProps) => {
    return (
        <Icon {...props} >${html}</Icon>
    )
}

export default Icon${compName}
            `;

            !fs.existsSync(outputDirectory) && fs.mkdirSync(outputDirectory)
            fs.writeFileSync(outputDirectory + `/${compName}.tsx`, component)
        });
    });
}


const start = async () => {

    const component = `import React from 'react';
import { Tag, TagProps, TagComponenntType } from 'naxui-manager';

export type IconProps <T extends TagComponenntType = "svg"> = TagProps<T>

const Icon = <T extends TagComponenntType = "svg">({ children, sx, ...rest }: IconProps<T>, ref: React.Ref<any>) => {
    const sp = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }
    return (
        <Tag 
        {...sp}
        component="svg"
        baseClass='svg-icon' 
        fontSize={24}
        userSelect="none"
        width="1em"
        height="1em"
        display="inline-block"
        verticalAlign="middle"
        {...rest} 
        sx={{
            fill: "currentColor",
        ...(sx as any || {})
        }}
        ref={ref}
        >{children}</Tag>
    )
}

export default React.forwardRef(Icon) as typeof Icon
            `;
    const outputDirectory = path.join(__dirname, `src/`);
    !fs.existsSync(outputDirectory) && fs.mkdirSync(outputDirectory);
    fs.writeFileSync(outputDirectory + `/index.tsx`, component)

    const dirs = ["filled", "outlined", "round", "sharp", "two-tone"]
    for (let dir of dirs) {
        await convert(dir)
    }

}

start()

// app.get('/', )


// app.listen(5000)