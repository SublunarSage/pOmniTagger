import dash
from dash import dcc, html, Input, Output

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout
app.layout = html.Div([
    dcc.Input(id='input-box', type='text'),
    html.Button('Submit', id='button'),
    html.Div(id='output-container'),
    html.Img(src="https://i.imgur.com/oke7l7p.gif"),
    html.Div([
        html.H1("Hello World!"),
        html.P("This is a simple Dash app running in a Pywebview window.")
    ])
])

# Define the callback
@app.callback(
    Output('output-container', 'children'),
    Input('button', 'n_clicks'),
    Input('input-box', 'value')
)
def update_output(n_clicks, value):
    if n_clicks is None:
        return ''
    return f'You\'ve entered: {value}. Number of clicks: {n_clicks}'

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
