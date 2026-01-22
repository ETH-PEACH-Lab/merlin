import os
from openai import OpenAI
from dotenv import load_dotenv
import time

load_dotenv(override=True)
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

def generate_response(prompt, model):
    while True:
        try:
            completion = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
             )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Error {e} occurred while generating response. Retrying in 2 seconds...")
            time.sleep(2)

def read_examples_from_folder(folder_path):
    examples_text = ""
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".txt"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                examples_text += f"\n{content}\n"
    return examples_text

def generate_prompt():
    examples_folder = os.path.join(os.path.dirname(__file__), "few_shot_examples")
    examples_content = read_examples_from_folder(examples_folder)

    with open(os.path.join(os.path.dirname(__file__), "documentation.txt"), "r", encoding="utf-8") as f: documentation_content = f.read().strip()

    prompt_base = f'''
    You are an expert in the Merlin language, which visualizes algorithms step by step.

    ROLE
    ----
    Given a problem statement, a reference implementation, and an instance, you must output valid Merlin code 
    that demonstrates the algorithm's execution step by step on the given instance.

    MERLIN DOCUMENTATION
    --------------------
    Below is the Merlin language documentation. You must strictly follow it and only use data structures,
    properties and methods that it defines, so that the generated code is valid and compliant:
    {documentation_content}

    EXAMPLES
    --------
    Below are some example problem statements with their reference implementations, instances,
    and the corresponding Merlin visualizations. Use them as guidance for generating your own Merlin code.
    {examples_content}
    '''

    with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r", encoding="utf-8") as f: input_content = f.read().strip()

    with open(os.path.join(os.path.dirname(__file__), "common_mistakes.txt"), "r", encoding="utf-8") as f: common_mistakes = f.read().strip()

    prompt_instruct = f'''
    CONSTRAINTS ON THE VISUALIZATION
    --------------------------------
    During output generation, you must ensure that the visualization strictly adheres to the following criteria:

    a. **Documentation compliance**:
       - Use only features defined in the Merlin documentation above.

    b. **Algorithmic Faithfulness**:
       - The visualization must accurately represent the intended algorithm.
       - Ensure that all algorithmic steps, decisions, and data structure manipulations are correctly depicted.

    c. **Clarity and presentation**:
       - The sequence of slides must follow a clear logical order.
       - Visual language must stay stable throughout: same color codes, shapes, variable names, and layout conventions.
       - Maintain visual balance, spacing, and element alignment.

    d. **Efficiency and level of detail**:
       - Show every *meaningful* step, clearly highlighting all variable updates, pointer movements,
         and algorithmic decisions.
       - Compress repetitive or minor operations by grouping similar steps or summarizing patterns
         instead of expanding each operation separately.
       - Avoid unnecessary verbosity: only include essential text that explains what the visuals
         cannot show alone.       
       - Do not create too many pages: target around 5–15 pages for a standard algorithm on a
         standard input size (this is a guideline, not a hard limit).

    COMMON PITFALLS TO AVOID
    ------------------------
    The following are common pitfalls when generating Merlin visualizations. You must avoid them:

    {common_mistakes}

    INPUT TO VISUALIZE
    ------------------
    Now, given the following Problem Statement, Reference Implementation, and Instance, provide the Merlin code.

    {input_content}
    '''

    prompt = prompt_base + "\n\n" + prompt_instruct
    return prompt


if __name__ == "__main__":
    model = "gpt-5"
    prompt = generate_prompt()

    start_time = time.time()

    response = generate_response(prompt, model)

    end_time = time.time()  
    elapsed_time = end_time - start_time
    
    output_dir = "outputs"
    os.makedirs(output_dir, exist_ok=True)  
    output_path = os.path.join(output_dir, "response.txt")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(response)

    print(f"Response saved to {output_path}")

    print(f"Total time taken: {elapsed_time:.2f} seconds")
    
