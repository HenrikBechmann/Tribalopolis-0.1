// basiceditor.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { Editor, EditorState, RichUtils } from 'draft-js';

import 'draft-js/dist/Draft.css'

// console.log('RichUtils',RichUtils)

class BasicEditor extends React.Component<any,any> {

    state = {
        editorState: EditorState.createEmpty()
    }

    onChange = (editorState) => {
        this.setState({
          editorState 
        }) 
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
          this.onChange(newState);
          return 'handled';
        }
        return 'not-handled';
    }

    onUnderlineClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    onBoldClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    }

    onItalicClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
    }

    render() {
        return(
          <div>
            <button onClick={this.onUnderlineClick}><span style = {{textDecoration:'underline'}}>U</span></button>
            <button onClick={this.onBoldClick}><b>B</b></button>
            <button onClick={this.onItalicClick}><em>I</em></button>        
            <div style = {{border:'1px solid silver',maxWidth:'400px'}}>
                <Editor 
                  editorState={this.state.editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange= { this.onChange }
                  />
            </div>
          </div>
        )
    }
}

export default BasicEditor